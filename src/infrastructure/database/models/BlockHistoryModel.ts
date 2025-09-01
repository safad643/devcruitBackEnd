import { Schema, model } from "mongoose"

const blockHistorySchema = new Schema(
  {
    entityId: { type: String, required: true },
    entityType: { type: String, required: true, enum: ['developer', 'company'] },
    action: { type: String, required: true, enum: ['blocked', 'unblocked'] },
    reason: { type: String, required: true },
    details: { type: String },
    performedAt: { type: Date, required: true, default: () => new Date() },
    performedBy: { type: String },
  },
  {
    timestamps: true,
  },
)

blockHistorySchema.index({ entityId: 1, entityType: 1 })
blockHistorySchema.index({ entityId: 1, entityType: 1, action: 1 })

blockHistorySchema.pre('save', async function(next) {
  try {
    const { entityId, entityType } = this
    
    let entityExists = false
    
    if (entityType === 'developer') {
      const DeveloperModel = model('Developer')
      const count = await DeveloperModel.countDocuments({ _id: entityId })
      entityExists = count > 0
    } else if (entityType === 'company') {
      const CompanyModel = model('Company')
      const count = await CompanyModel.countDocuments({ _id: entityId })
      entityExists = count > 0
    }
    
    if (!entityExists) {
      throw new Error(`Referenced ${entityType} with ID ${entityId} does not exist`)
    }
    
    next()
  } catch (error) {
    next(error as Error)
  }
})

export const BlockHistoryModel = model("BlockHistory", blockHistorySchema)
