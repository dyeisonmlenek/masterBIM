import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as CUI from "@thatopen/ui-obc"
import { loadModelBtnTemplate } from "../buttons";
import { queriesList } from "../tables/queries";
import { appIcons } from "../../globals";
import { SmartViews } from "../../bim-components/SmartViews";

export interface QueriesPanelState {
  components: OBC.Components;
}

export const queriesPanelTemplate: BUI.StatefullComponent<
  QueriesPanelState
> = (state) => {
  const { components } = state;

  const [modelsList] = queriesList({
    components,
  });

  const onSearch = (e: Event) => {
    const input = e.target as BUI.TextInput;
    modelsList.queryString = input.value;
  };

  const finder = components.get(OBC.ItemsFinder);

  const onExport = () => {
    const exported = finder.export();
    const blob = new Blob([JSON.stringify(exported)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "queries.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const text = await file.text();
        const data = JSON.parse(text);
        finder.import(data);
      }
    };
    input.click();
  };

  return BUI.html`
  <bim-panel-section fixed label="Pesquisas">
    <div style="display: flex; gap: 0.5rem; justify-content: space-between;">
      <bim-button @click=${onExport} label="Exportar" icon="mdi:download"></bim-button>
      <bim-button @click=${onImport} label="Importar" icon="mdi:upload"></bim-button>
    </div>
    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
      <bim-text-input @input=${onSearch} placeholder="Buscar..." debounce="200"></bim-text-input>
    </div>
    ${modelsList}
  </bim-panel-section>`;
};
