import localization from '../localization';

export async function handleError(dispatch, e, timeShow, noThrow=false, ignore={}) {
    let data = e?.response?.data;
    if (ignore[e?.response?.status])
        return;

    // so if there is text-only error, then I can just show a notification
    if (data?.detail || typeof(data) === "string") {
        dispatch('placeNotification', {
            text: localization.state.tr(data?.detail ?? data ?? ''),
            type: "danger",
            time: timeShow || undefined
        }, {root: true});
        
        data = null;
    }
    else {
        for (const [key, err] of Object.entries(data)) {
            if (!Array.isArray(err)) {
                data[key] = [err];
            }
        }
    }

    if (!noThrow) {
        throw data || null;
    }
}
