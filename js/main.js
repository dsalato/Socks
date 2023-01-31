let eventBus = new Vue()

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
                <product-info :shipping="shipping" :details = 'details' ></product-info>


                <div class="color-box"
                     v-for="(variant, index) in variants"
                     :key="variant.variantId"
                     :style="{ backgroundColor:variant.variantColor }"
                     @mouseover="updateProduct(index)"
                >
                </div>
                
                <select>
                    <option v-for="size in sizes">{{ size }}</option>
                </select>

                
                <div>

                <button v-on:click="addToCart"
                            :disabled="!inStock"
                            :class="{ disabledButton: !inStock }"
                >Add to cart</button>
    
                <button v-on:click="remoteToCart">Remote to cart</button>
                </div>
                <product-tabs :reviews="reviews"></product-tabs>
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
            reviews: [],
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            altText: "A pair of socks",
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,


                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 5,


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
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
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
            <form  @submit.prevent="addDetails">
                <label for="name">Details:</label>
                <input id="name" v-model="name"  placeholder="name">
                <input type="submit" value="Submit"> 
            </form>

       </div>

       </div>


        </div>`,

    props: {
        details: {
            type: Array,
        }
    },
    methods: {
        addDetails(){

            this.details.push(name)

        }
    }

})
Vue.component('product-review', {
    template: `

   <form class="review-form" @submit.prevent="onSubmit">
      
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
    
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <p>Would you recommend this product?</p>
            <label for="recommendation">yes:</label>
            <input type="radio" name="type" id="recommendation" value="yes" v-model="recommedation" >
            
             <label for="recommendation2">no:</label>
            <input type="radio" name="type" id="recommendation2" value="no" v-model="recommedation" >
        </p>
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                 <option>5</option>
                 <option>4</option>
                 <option>3</option>
                 <option>2</option>
                 <option>1</option>
            </select>
        </p>
    
        <p>
            <input type="submit" value="Submit"> 
        </p>

    </form>

 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommedation: null,
            errors: []
        }

    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommedation) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommedation: this.recommedation
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommedation = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.recommedation) this.errors.push("Recommedation required.")
                if(!this.rating) this.errors.push("Rating required.")

            }
        }

    }
})
Vue.component('product-tabs', {
    template: `
   <div>
       <ul>
         <span class="tab"
         :class="{ activeTab: selectedTab === tab }"
          v-for="(tab, index) in tabs" 
          @click="selectedTab = tab"
          :key="index">{{ tab }}</span>
       </ul>

       <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>Recommedation: {{ review.recommedation}}</p>
                    <p>{{ review.review }}</p>
                </li>
            </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
            <product-review ></product-review>
       </div>
 
   </div>
 `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    },
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },

})
Vue.component('product-info', {
    template: `
   <div>
       <ul>
         <span class="tab"
         :class="{ activeTab: selectedInfo === tab }"
          v-for="(tab, index) in infos" 
          @click="selectedInfo = tab"
          :key="index">{{ tab }}</span>
       </ul>

       <div v-show="selectedInfo === 'Shipping'">
            <p>Shipping: {{ shipping }} </p>
       </div>
       
       <div v-show="selectedInfo === 'Details'">
            <product-details :details = 'details'></product-details>
       </div>
 
   </div>
 `,
    data() {
        return {
            infos: ['Shipping', 'Details'],
            selectedInfo: 'Shipping',

        }
    },
    props: {
        shipping: {
            required: false
        },
        details: {
            type: Array,
            required: false
        }
    },

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

        },
        removeCart(id){
            if( this.cart.includes(id)){
                this.cart.splice(this.cart.indexOf(id), 1)

            }

        }
    }


})

