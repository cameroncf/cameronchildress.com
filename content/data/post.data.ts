 import { createContentLoader } from "vitepress";

// export default createContentLoader("posts/*.md" /* options */);

export default {
  load() {
    return {
      hello: createContentLoader("posts/*.md" /* options */)
    }
  }
}
