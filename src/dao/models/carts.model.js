import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'products',
        required: true
        },
        quantity: {
        type: Number,
        required: true,
        
        }
    }],
});

cartSchema.pre("find", function(){
    this.populate("products.product");
})

const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;