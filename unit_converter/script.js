const millimeterEl = document.querySelector("#millimeter");
const centimeterEl = document.querySelector("#centimeter");
const meterEl = document.querySelector("#meter");
const kilometerEl = document.querySelector("#kilometer");
const celciusEl=document.querySelector("#celcius");
const fahrenheitEl=document.querySelector("#fahrenheit");
const kelvinEl=document.querySelector("#kelvin");
const milligramEl = document.querySelector("#milligram");
const centigramEl = document.querySelector("#centigram");
const gramEl = document.querySelector("#gram");
const kilogramEl = document.querySelector("#kilogram");

function millimeter(value) {
	centimeterEl.value = value / 10;
	meterEl.value = value / 1000;
	kilometerEl.value = value / 1000000;
}

function centimeter(value) {
	millimeterEl.value = value * 10;
	meterEl.value = value / 100;
	kilometerEl.value = value / 100000;
}

function meter(value) {
	millimeterEl.value = value * 1000;
	centimeterEl.value = value * 100;
	kilometerEl.value = value / 1000;
}

function kilometer(value) {
	millimeterEl.value = value * 1000000;
	centimeterEl.value = value * 10000;
	meterEl.value = value * 1000;
}

function celcius(value) {
	fahrenheitEl.value = (value * 9/5)+32;
	kelvinEl.value = value +273.15;
}

function fahrenheit(value) {
	celciusEl.value = (value -32)*5/9;
	kelvinEl.value = (value -32)*(5/9)+273.15;
}

function kelvin(value) {
	celciusEl.value = value -273.15;
	fahrenheitEl.value = (value -273.15)*(9/5)+32 ;
}

function milligram(value) {
	centigramEl.value = value / 10;
	gramEl.value = value / 1000;
	kilogramEl.value = value / 1000000;
}

function centigram(value) {
	milligramEl.value = value * 10;
	gramEl.value = value / 100;
	kilogramEl.value = value / 100000;
}

function gram(value) {
	milligramEl.value = value * 1000;
	centigramEl.value = value * 100;
	kilogramEl.value = value / 1000;
}

function kilogram(value) {
	milligramEl.value = value * 1000000;
	centigramEl.value = value * 10000;
	gramEl.value = value * 1000;
}