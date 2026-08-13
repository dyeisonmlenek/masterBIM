import * as OBC from "@thatopen/components"
import * as FRAGS from "@thatopen/fragments"
import { DataEnhancerSource } from "./src";

export class DataEnhancer extends OBC.Component {
  static uuid = "d9d41a68-2606-4c61-9e86-af6b675758ef" as const
  enabled = true;

  private _sourcesDataCache: Record<string, any[]> = {}

  readonly sources = new FRAGS.DataMap<string, DataEnhancerSource>()

  async getSourceData(source: string) {
    const sourceConfig = this.sources.get(source)
    if (!sourceConfig) {
      throw new Error(`DataEnhancer: Source "${source}" not found`)
    }

    let data = this._sourcesDataCache[source]
    if (!data) {
      data = await sourceConfig.data()
      this._sourcesDataCache[source] = data
    }

    return data
  }

  async getData(items: OBC.ModelIdMap) {
    const fragments = this.components.get(OBC.FragmentsManager)
    const result: OBC.ModelIdDataMap<Record<string, any[]>> = new FRAGS.DataMap()
    for (const [modelId, _localIds] of Object.entries(items)) {
      const model = fragments.list.get(modelId)
      if (!model) continue
      const localIds = [..._localIds]
      const itemsData = await model.getItemsData(localIds)
      for (const [source, config] of this.sources.entries()) {
        const sourceData = await this.getSourceData(source)
        for (const [index, attributes] of itemsData.entries()) {
          const itemExternalData = config.matcher(attributes, sourceData)
          if (!itemExternalData) continue

          let modelResult = result.get(modelId)
          if (!modelResult) {
            modelResult = new FRAGS.DataMap()
            result.set(modelId, modelResult)
          }

          const localId = localIds[index]
          let itemSources = modelResult.get(localId)
          if (!itemSources) {
            itemSources = {}
            modelResult.set(localId, itemSources)
          }

          itemSources[source] = itemExternalData
        }
      }
    }
    return result
  }

  async getItemsBySourceData(source: string, condition: (data: any[]) => boolean) {
    const config = this.sources.get(source)
    if (!config) throw new Error(`DataEnhancer: Source "${source}" not found`)
    
    const sourceData = await this.getSourceData(source)
    const fragments = this.components.get(OBC.FragmentsManager)
    const result: OBC.ModelIdMap = {}
    
    for (const [modelId, model] of fragments.groups.entries()) {
      if (!model.data) continue;
      const localIds = Array.from(model.data.keys())
      if (!localIds.length) continue;
      
      const itemsData = await model.getItemsData(localIds)
      const matchingIds = new Set<number>()
      
      for (const [index, attributes] of itemsData.entries()) {
        const itemExternalData = config.matcher(attributes, sourceData)
        if (itemExternalData && condition(itemExternalData)) {
          matchingIds.add(localIds[index])
        }
      }
      
      if (matchingIds.size > 0) {
        result[modelId] = matchingIds;
      }
    }
    
    return result;
  }
}