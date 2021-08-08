import enUS from './en-US.json';


const dictionaries = {
    '*': enUS,
    'en': {
        '*': enUS,
        'us': enUS
    }
};
const fullLang = navigator.language.split('-');
const currentLang = {
    base: fullLang[0],
    country: fullLang[1].toLowerCase()
};

const baseGroup = dictionaries[currentLang.base];
const primaryDictionary = baseGroup
    ? baseGroup[currentLang.country] ?? baseGroup['*']
    : dictionaries['*'];

function _(key) {
    return primaryDictionary[key] ?? key;
}

export {
    dictionaries,
    currentLang,
    primaryDictionary,
    _
};
