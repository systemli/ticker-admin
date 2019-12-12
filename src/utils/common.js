export class CommonUtils {
    static getValueOrDefault(value, defaultValue) {
        if (value !== undefined) {
            return value;
        }

        return defaultValue;
    }

    static mapValueArray(keys, values, defaultValues) {
        let target = {};
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            target[key] = this.getValueOrDefault(values[key], defaultValues[key]);
        }

        return target
    }
}
