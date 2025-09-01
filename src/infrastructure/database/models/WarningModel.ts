import { Schema, model } from "mongoose"

const warningSchema = new Schema(
  {
    entityId: { type: String, required: true },
    entityType: { type: String, required: true, enum: ['developer', 'company'] },
    reason: { type: String, required: true },
    details: { type: String },
    expectedResolution: { type: String },
    issuedAt: { type: Date, required: true, default: () => new Date() },
    read: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
)

warningSchema.index({ entityId: 1, entityType: 1 })
warningSchema.index({ entityId: 1, entityType: 1, read: 1 })

warningSchema.pre('save', async function(next) {
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

export const WarningModel = model("Warning", warningSchema)
