/**
 * @type {string} //Dient auch der typisierung (macht fehlermeldung falls kein String referenziert wird.
 **/
let a = "hallo"; //Immer am Anfang mit const anfangen auch wenn ich weis dass es später ein let wird
    a =  0;

/**
 * Logs the arg.
 * @param { "hi" | "hella" } arg
 * {!string} arg - must be non-empty
 */
const foo = arg => console.log(arg);

foo("he");
foo("hella");
foo(2);

/**
@param { String | Number | void } arg
 **/
const foo2 = arg => console.log(arg);

foo2("he");
foo2("hella");
foo2(2);