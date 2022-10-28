
import $c from 'chalk';
import { DEFAULT_CNF_NAME } from '../Constants';

const green = (x: string) => $c.green(x);
const grey = (x: string) => $c.grey(x);
const line = (x: string) => $c.underline(x);

const getFixedLength = (x: string, length: number) => 
    x + new Array(length - x.length).fill(',').join('');

const BRAND = `
__  _____ _     ___  
\\ \\/ /_ _| |   / _ \\ 
 \\  / | || |  | | | |
 /  \\_| || |__| |_| |
/_/\\_\\___|_____\\___/ 
`;

const TEXT = `
Note: Use --help To display a list of accepted parameters for specific commands.
___________________________________________________________________________________

init   <config>      Creates a template config file in a specified location.
                     Defaults to _./${DEFAULT_CNF_NAME}_.

       --force, -f   *Foce the template file.*

run    <config>      Starts the manager using the specified config file.
                     Defaults to _./${DEFAULT_CNF_NAME}_.
`

export default () => {
    let formattedText = TEXT
        .replace(/\n(?<x>\w+)*/g,                green("\n$1"))
        .replace(/\<(?<x>[a-zA-z ?]+)*\>/g,      grey("<$1>"))
        .replace(/\*(?<x>[a-zA-z ._<>*/]+)*\*/g, grey("$1"))
        .replace(/\_(?<x>[a-zA-z ./]+)*\_/g,     line("$1"))
        .replace(/--(?<x>[A-z]+)*/g,             grey('--$1'))
        .replace(/-(?<x>[A-z]+)*/g,              grey('-$1'))

    console.log(green(BRAND))
    console.log(formattedText)
}