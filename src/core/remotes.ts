type Factory = () => any;

interface Container {
  init(shareScope: string): Promise<void>;

  get(module: string): Promise<Factory>;
}

declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: string };
declare const __webpack_require__: {
  l(url: string, handler: (event: Event) => void, uniqueName: string): void;
};
type WebpackError = Error & { request: string };
declare const __webpack_error__: WebpackError;

export enum FileType {
  Component = "Component",
  Module = "Module",
  Css = "CSS",
  Html = "Html",
}

export class MfeUtil {
  // holds list of loaded script
  private scopeRemoteEntryMap: Record<string, string> = {};

  findExposedModule = async <T>(
    uniqueName: string,
    exposedFile: string
  ): Promise<T | undefined> => {
    const remoteEntry = this.scopeRemoteEntryMap[uniqueName];
    await this.loadRemoteEntry(remoteEntry, uniqueName);

    let Module: T | undefined;
    // Initializes the shared scope. Fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container: Container = (window as any)[uniqueName]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await container.get(exposedFile);
    Module = factory();
    return Module;
  };

  loadRemoteEntry = async (
    remoteEntry: string,
    uniqueName: string
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      __webpack_require__.l(
        remoteEntry,
        (event) => {
          if (typeof (global as any)[uniqueName] !== "undefined")
            return resolve();

          const errorType =
            event && event?.type === "load" ? "missing" : event.type;
          const realSrc = (event?.target as HTMLScriptElement)?.src;
          __webpack_error__.message = `Loading script failed.\\\n(${errorType}: ${realSrc})`;
          __webpack_error__.name = "ScriptEnternalLoadError";
          __webpack_error__.request = realSrc;
          reject(__webpack_error__);
        },
        uniqueName
      );
    });
  };

  async registerRemote(
    remoteEntry: string,
    scope: string,
    ...aliases: string[]
  ) {
    this.scopeRemoteEntryMap[scope] = remoteEntry;
    aliases.forEach((alias) => {
      this.scopeRemoteEntryMap[alias] = remoteEntry;
    });
  }

  async lazyImport(remoteResource: string) {
    const [uniqueName, exposedResource] = remoteResource.split("/");
    if (!uniqueName || !exposedResource)
      throw new Error(`Malformed remote resource name [${remoteResource}]`);
    return await this.findExposedModule(uniqueName, `./${exposedResource}`);
  }

  async loadRemote(uniqueName: string) {
    return await this.loadRemoteEntry(
      this.scopeRemoteEntryMap[uniqueName],
      uniqueName
    );
  }
}

(global as any).__module_federation__ = new MfeUtil();
