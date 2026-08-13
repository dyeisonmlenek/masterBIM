import * as OBC from "@thatopen/components"

export const setupIfcLoader = async (components: OBC.Components) => {
  const ifcLoader = components.get(OBC.IfcLoader);
  await ifcLoader.setup();
}