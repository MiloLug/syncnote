import enUS from './en-US.json';
import uk from './uk.json';

// * is default cases for each level of sub-groups
const dictionaries = {
    '*': enUS,
    'en': {
        '*': enUS,
        'us': enUS
    },
    'uk': {
        '*': uk
    }
};

export default dictionaries;
