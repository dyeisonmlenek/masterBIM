import * as OBC from "@thatopen/components"

export const setupIfcLoader = async (components: OBC.Components) => {
  const ifcLoader = components.get(OBC.IfcLoader);
  ifcLoader.settings.wasm = {
    path: import.meta.env.BASE_URL,
    absolute: true
  };
  await ifcLoader.setup({ autoSetWasm: false });
}