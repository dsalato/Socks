Vue.component('product', {
    template: `
        <div class="product">
            <div class="product-image">
                <img :alt="altText" v-bind:src="image"/>
            </div>
    
            <div class="product-info">
                <h1 v-if="onSale">{{ sale }}</h1>
                <h1 v-else>{{ title }}</h1>
    
                <p v-if="inStock">In stock</p>
                <p v-else :class="{outOfStock: !inStock }">Out of Stock</p>
    
                <product-details :details='details'></product-details>
                
                <p>Shipping: {{ shipping }}</p>
                <div class="color-box"
                     v-for="(variant, index) in variants"
                     :key="variant.variantId"
                     :style="{ backgroundColor:variant.variantColor }"
                     @mouseover="updateProduct(index)"
                >
                </div>
    
                <ul>
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>

                <button v-on:click="addToCart"
                            :disabled="!inStock"
                            :class="{ disabledButton: !inStock }"
                >Add to cart</button>
    
                <button v-on:click="remoteToCart">Remote to cart</button>
    
            </div>
       </div>
       
    `,
    props: {
        premium: {
            type: Boolean,
            required: true
        },
        cart: {
            type: Number
        }
    },
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            onSale:true,
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10

                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 5

                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],

        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
            this.variants[this.selectedVariant].variantId);
        },
        remoteToCart() {
            this.$emit('delete-cart',
            this.variants[this.selectedVariant].variantId);

        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            return this.brand + ' ' + this.product + ' On sale';
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }

    }
})
Vue.component('product-details', {
    template: `
        <div className="product-details">

            <ul>
                <li v-for="detail in details">{{detail}}</li>
            </ul>

        </div>`,
    props: {
        details: {
            type: Array,
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
            console.log(this.cart)
        },
        removeCart(id){
            if( this.cart.includes(id)){
                this.cart.splice(this.cart.indexOf(id), 1)
                console.log(this.cart)
            }

        }
    }


})

