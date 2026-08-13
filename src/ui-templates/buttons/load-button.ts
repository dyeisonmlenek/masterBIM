import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import { appIcons } from "../../globals";

export interface LoadModelBtnState {
  components: OBC.Components
}

export const loadModelBtnTemplate: BUI.StatefullComponent<LoadModelBtnState> = (
  state,
) => {
  const { components } = state
  const onLoadIfc = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = ".ifc";

    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const ifcLoader = components.get(OBC.IfcLoader)
        const model = await ifcLoader.load(
          bytes,
          true,
          file.name.replace(".ifc", "")
        );
        
        const worlds = components.get(OBC.Worlds);
        const world = worlds.list.values().next().value;
        if (world && world.camera && world.camera.controls) {
          if (model.box) {
            world.camera.controls.fitToBox(model.box, true);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar o modelo IFC:", err)
        alert("Ocorreu um erro ao carregar o modelo. Verifique o console.")
      }
    })

    input.click();
  }

  const onLoadFrag = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = ".frag";

    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      const buffer = await file.arrayBuffer();

      const fragments = components.get(OBC.FragmentsManager)
      const model = await fragments.core.load(buffer, {
        modelId: file.name.replace(".frag", "")
      });

      const worlds = components.get(OBC.Worlds);
      const world = worlds.list.values().next().value;
      if (world && world.camera && world.camera.controls) {
        if (model.box) {
          world.camera.controls.fitToBox(model.box, true);
        }
      }
    });

    input.click();
  }

  return BUI.html`<bim-button icon=${appIcons.ADD}>
    <bim-context-menu>
      <bim-button class="transparent" @click=${onLoadFrag} label="Carregar FRAG"></bim-button>
      <bim-button class="transparent" @click=${onLoadIfc} label="Carregar IFC"></bim-button>
    </bim-context-menu>
  </bim-button>`
}
