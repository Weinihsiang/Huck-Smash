int percent = 0;
int prevPercent = 0;
int b = 98;
String a = "af";
void setup() {
  
  
  Serial.begin( 9600 );
  
}

void loop() {
  
  percent = round(analogRead(2) / 1024.00 * 100);
  b = 234;
  if(percent != prevPercent) {
    a+="a";
    Serial.println(b);
    Serial.println(a);
    
    prevPercent = percent;
    
  }
  
  delay(100);
  
}

