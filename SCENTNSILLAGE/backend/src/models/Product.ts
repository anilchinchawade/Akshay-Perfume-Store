import mongoose,{Schema} from "mongoose";
const variantSchema=new Schema({id:{type:String,required:true},size:{type:Number,required:true},unit:{type:String,default:"ml"},price:{type:Number,required:true,min:0},compareAtPrice:Number,stock:{type:Number,default:0,min:0},sku:{type:String,required:true}}, {_id:false});
const productSchema=new Schema({
 id:{type:String,required:true,unique:true},name:{type:String,required:true,trim:true},slug:{type:String,required:true,unique:true,index:true},brand:{type:String,required:true,index:true},category:{type:String,required:true},
 description:{type:String,required:true},shortDescription:{type:String,required:true},gender:{type:String,enum:["men","women","unisex"],required:true},concentration:{type:String,enum:["EDT","EDP","Parfum","Cologne"],required:true},
 scentFamily:[String],notes:{top:[String],middle:[String],base:[String]},season:[String],occasion:[String],longevity:String,sillage:String,variants:[variantSchema],images:[{url:String,alt:String}],
 rating:{type:Number,default:0},reviewCount:{type:Number,default:0},popularity:{type:Number,default:0},isNew:Boolean,isBestseller:Boolean,isFeatured:Boolean,isDiscoverySet:Boolean,authenticityGuaranteed:Boolean,batchInformation:String,
 isActive:{type:Boolean,default:true}
},{timestamps:true});
productSchema.index({name:"text",brand:"text",description:"text","notes.top":"text","notes.middle":"text","notes.base":"text"});
export const Product=mongoose.models.Product || mongoose.model("Product",productSchema);
