// diContainer.js
class DIContainer {
    private static instance: DIContainer
    private dependencies: any
    private constructor() {
        this.dependencies = {};
    }

    static createInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    register<T>(key: string, dependency: T): void {
        this.dependencies[key] = dependency;
    }

    resolve<T>(key: string): T {
        if (this.dependencies[key]) {
            return this.dependencies[key];
        }
        throw new Error(`Dependency not found for key: ${key}`);
    }
}


const dIContainer = DIContainer.createInstance()

export default dIContainer