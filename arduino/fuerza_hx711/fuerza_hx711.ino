/*
 * Fuerza en Newton con UN módulo HX711 y 4 celdas de carga en puente
 * (báscula tipo "bathroom scale"). Entrega la fuerza TOTAL.
 *
 * SIN librerías externas: el HX711 se lee directo (protocolo de 25 pulsos).
 *
 * Conexión:
 *   HX711 GND -> Arduino GND
 *   HX711 DT  -> Arduino D2
 *   HX711 SCK -> Arduino D3
 *   HX711 VCC -> Arduino 5V
 *   Celdas: E+, E-, A-, A+ del HX711 (B- y B+ libres).
 *
 * Serial a 115200 baudios. Una línea cada ~100 ms:  N   (Newton, 2 decimales)
 * Las líneas de mensajes empiezan con "#".
 *
 * Comandos (Monitor Serie, terminar con Enter):
 *   t          Tara (hacer SIN carga).
 *   c <gramos> Calibra con un peso conocido ya puesto. Ej.: "c 500".
 *   f          Muestra el factor de calibración y el valor crudo.
 *   p          Pausa / reanuda la salida de datos.
 *
 * El factor de calibración y la tara se guardan en EEPROM (no se pierden
 * al reiniciar ni al abrir el puerto serial).
 * Nota: "SCK" es un nombre reservado de la placa, por eso se usa PIN_CLK.
 */

#include <EEPROM.h>

const uint8_t PIN_DT  = 2;
const uint8_t PIN_CLK = 3;

const float GRAVEDAD = 9.80665f;         // 1 kgf = 9,80665 N
const uint8_t EE_MAGIC = 0xA5;
const unsigned long PERIODO_MS = 100;
const long SIN_DATO = 999999999L;

long offsetCrudo = 0;                    // tara (cuentas)
float factor = 1.0f;                     // cuentas por Newton
bool streaming = true;
unsigned long tPrev = 0;

// Lee una muestra del HX711 (canal A, ganancia 128). SIN_DATO si no responde.
long leerCrudo() {
  uint32_t t = millis();
  while (digitalRead(PIN_DT)) {
    if (millis() - t > 500) return SIN_DATO;
  }
  uint32_t v = 0;
  noInterrupts();
  for (uint8_t i = 0; i < 24; i++) {
    digitalWrite(PIN_CLK, HIGH);
    delayMicroseconds(2);
    v = (v << 1) | digitalRead(PIN_DT);
    digitalWrite(PIN_CLK, LOW);
    delayMicroseconds(2);
  }
  digitalWrite(PIN_CLK, HIGH);           // pulso 25: canal A, ganancia 128
  delayMicroseconds(2);
  digitalWrite(PIN_CLK, LOW);
  interrupts();
  if (v & 0x800000UL) v |= 0xFF000000UL; // extensión de signo (24 -> 32 bits)
  return (long)v;
}

// Promedio de n muestras; SIN_DATO si alguna falla.
long promedio(uint8_t n) {
  long suma = 0;
  for (uint8_t i = 0; i < n; i++) {
    long r = leerCrudo();
    if (r == SIN_DATO) return SIN_DATO;
    suma += r;
  }
  return suma / n;
}

void guardarFactor() {
  EEPROM.update(0, EE_MAGIC);
  EEPROM.put(1, factor);
  EEPROM.put(5, offsetCrudo);
}

void cargarFactor() {
  if (EEPROM.read(0) == EE_MAGIC) {
    EEPROM.get(1, factor);
    EEPROM.get(5, offsetCrudo);
  }
  if (isnan(factor) || factor == 0.0f) factor = 1.0f;
}

void tarar() {
  long r = promedio(15);
  if (r == SIN_DATO) {
    Serial.println(F("# ERROR: el HX711 no responde (revisa DT, SCK, VCC y GND)"));
    return;
  }
  offsetCrudo = r;
  guardarFactor();                       // la tara también queda guardada
  Serial.println(F("# Tara lista"));
}

void calibrar(float gramos) {
  if (gramos <= 0) { Serial.println(F("# Uso: c <gramos>, ej. c 500")); return; }
  long r = promedio(15);
  if (r == SIN_DATO) { Serial.println(F("# ERROR: el HX711 no responde")); return; }
  float cuentas = (float)(r - offsetCrudo);
  if (fabs(cuentas) < 50) {
    Serial.println(F("# Casi no hay señal: ¿pusiste el peso? ¿hiciste 't' antes sin carga?"));
    return;
  }
  float newton = (gramos / 1000.0f) * GRAVEDAD;
  factor = cuentas / newton;
  guardarFactor();
  Serial.print(F("# Calibrado con ")); Serial.print(newton, 3);
  Serial.print(F(" N. Factor = ")); Serial.println(factor, 3);
}

void procesarComando(String s) {
  s.trim();
  if (s.length() == 0) return;
  char c = s.charAt(0);
  if (c == 't') {
    tarar();
  } else if (c == 'c') {
    calibrar(s.substring(1).toFloat());
  } else if (c == 'f') {
    Serial.print(F("# Factor = ")); Serial.print(factor, 3);
    Serial.print(F(" cuentas/N, tara = ")); Serial.print(offsetCrudo);
    Serial.print(F(", crudo = ")); Serial.println(leerCrudo());
  } else if (c == 'p') {
    streaming = !streaming;
    Serial.println(streaming ? F("# Reanudado") : F("# Pausado"));
  } else {
    Serial.println(F("# Comandos: t | c <gramos> | f | p"));
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_DT, INPUT);
  pinMode(PIN_CLK, OUTPUT);
  digitalWrite(PIN_CLK, LOW);
  cargarFactor();
  delay(500);
  Serial.println(F("# Listo. Salida: fuerza total en Newton"));
  // Sin tara automática: la tara y el factor se cargan de la EEPROM.
}

void loop() {
  if (Serial.available()) procesarComando(Serial.readStringUntil('\n'));
  if (!streaming) return;

  // Se manda cada lectura apenas el HX711 la tiene lista (10/s, o 80/s si el
  // módulo tiene RATE a 5V). leerCrudo() espera a que haya dato, así que el
  // ritmo lo marca el propio chip. Importante para captar el pico de un golpe.
  long r = leerCrudo();
  if (r == SIN_DATO) { Serial.println(F("# sin respuesta del HX711")); return; }
  Serial.println((float)(r - offsetCrudo) / factor, 2);
}
