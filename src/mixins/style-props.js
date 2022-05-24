const styles = [
    {prop: "shadow", prefix: "quartz-shadow-", default: null},
    {prop: "innerShadow", prefix: "quartz-inner-shadow-", default: null},
    {prop: "quartzActive", prefix: "quartz-active-", default: null},
    {prop: "quartzFocus", prefix: "quartz-focus-", default: null},

    {prop: "borderColor", cssProp: "border-color", default: null},
    {prop: "borderWidth", cssProp: "border-width", default: null},
];

const cssStyles = styles.filter(item => item['cssProp']);
const classStyles = styles.filter(item => !item['cssProp']);

export default styles.reduce((acc, style)=>(
    acc[style.prop] = {
        default: ()=>style.default
    },
    acc
), {});

export function applyClasses(instance) {
    const classes = classStyles.reduce((acc, style)=>{
        if (instance[style.prop] !== null)
            acc.push(style.prefix + instance[style.prop]);
        return acc;
    }, []);
    return cssStyles.reduce((acc, style)=>{
        if (instance[style.prop] !== null)
            acc.push("has-" + style.prop);
        return acc;
    }, classes);
}

export function applyCss(instance) {
    return cssStyles.reduce((acc, style)=>{
        if (instance[style.prop] !== null)
            acc.push(style.cssProp + ":" + instance[style.prop]);
        return acc;
    }, []);
}
