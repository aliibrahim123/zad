/**********************************************************************************
* @function  : hijriToCalendars(year, month, day, [options])
*
* @purpose   : Converts Islamic (Hijri) Date to other Calendars' Dates.
*              Handles Hijri dates from -280,803 AH to +281,510 AH.
*              Handles all 5 Islamic Calendar Types.
*              Uses the 'JS Calendar Conversion by Target Approximation' Method.
*              No external libraries or complex mathematical/astronomical formulas.
*
* @version   : 1.00
* @author    : Mohsen Alyafei
* @date      : 21 Feb 2022
* @licence   : MIT
* @param     : year   : (numeric) [required] Hijri year  (-280803 to 281510)
* @param     : month  : (numeric) [required] hijri month (1 to 12) note: months is standard 1 based
* @param     : day    : (numeric) [required] hijri day   (1 to 29/30)
* @param     : options: Object with the following optional parameters:
*
*              'fromCal': Specifies the the type of input Islamic Calendar with 5 options:
*                         - 'islamic-umalqura' (default)
*                         - 'islamic-civil'
*                         - 'islamic-tbla'
*                         - 'islamic-rgsa'
*                         - 'islamic'
*
*              'toCal' : Specifies the the type of output Calendar to convert to with 19 Calendars:
*                        - "gregory" : (default)
*                        - "buddhist", "chinese", "coptic", "dangi", "ethioaa", "ethiopic",
*                          "hebrew", "indian", "islamic", "islamic-umalqura", "islamic-tbla",
*                          "islamic-civil", "islamic-rgsa", "iso8601", "japanese", "persian", "roc".
*
*               'dateStyle' Same as used in the Intl.DateTimeFormat() constructor.
*                           If not stated, default output is in Gregorian ISO Format: YYYY:MM:DDTHH:mm:ss.sssZ
*
*               'locale' The BCP 47 language tag for formatting (default is 'en').
*
*               Other options: As used in the Intl.DateTimeFormat() constructor.
*
* @returns   : Return the date in the calendar and format of the specified options.
********************************************************************************** */



//**********************************************************************************
function hijriToCalendars(year, month, day, op={}) {
 op.fromCal ??= "islamic-umalqura";   //
let   gD      = new Date(Date.UTC(2000,0,1));
      gD      = new Date(gD.setUTCDate(gD.getUTCDate() +
                ~~(227022+(year+(month-1)/12+day/354)*354.367)));
const gY      = gD.getUTCFullYear(gD)-2000,
      dFormat = new Intl.DateTimeFormat('en-u-ca-' + op.fromCal, {dateStyle:'short', timeZone:'UTC'});
      gD      = new Date(( gY < 0 ? "-" : "+")+("00000" + Math.abs(gY)).slice(-6)+"-"+("0" + (gD.getUTCMonth(gD)+1)).slice(-2)+"-" + ("0" + gD.getUTCDate(gD)).slice(-2));
let [iM,iD,iY]= [...dFormat.format(gD).split("/")], i=0;
      gD      = new Date(gD.setUTCDate(gD.getUTCDate() +
                ~~(year*354+month*29.53+day-(iY.split(" ")[0]*354+iM*29.53+iD*1)-2)));
while (i < 4) {
   [iM,iD,iY] = [...dFormat.format(gD).split("/")];
   if (iD == day && iM == month && iY.split(" ")[0] == year) return formatOutput(gD);
   gD = new Date(gD.setUTCDate(gD.getUTCDate()+1)); i++;
   }
throw new Error("Invalid "+op.fromCal+" date!");
function formatOutput(gD){
return "toCal"in op ? (op.calendar= op.toCal,
    new Intl.DateTimeFormat(op.locale ??= "en", op).format(gD)) : gD;
}
}
//**********************************************************************************

export var fromHijri = (day, month, year) => {
	var date = hijriToCalendars(year, month, day);
	day = date.getDate();
	month = date.getMonth() +1;
	year = date.getFullYear();
	return [day, month, year]
}
export var toHijri = (day, month, year) => {
	var date = new Date(`${month}/${day +1}/${year}`);
	date.setFullYear(year);
	[month, day, year] = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {dateStyle:'short'})
	  .format(date).split('/');
	return [day, month, year.split(' ')[0]].map(v=> Number(v))
}