export function checkArrayTypes() {
    for (var i = 0; i < arguments.length; i++) {
        if (!(arguments[i] instanceof Uint8Array))
            throw new TypeError('unexpected type, use Uint8Array');
    }
}

export function cleanup(arr) {
    for (var i = 0; i < arr.length; i++) arr[i] = 0;
}