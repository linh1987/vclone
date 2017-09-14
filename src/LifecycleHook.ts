export class LifecycleHook {
    update: Function = null;
    unmount: Function = null;

    constructor(update: Function, unmount: Function) {
        this.update = update;
        this.unmount = unmount;
    }
}