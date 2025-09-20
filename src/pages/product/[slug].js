import React, {useState} from "react";
import {AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar} from "react-icons/ai";
import { client, urlFor } from "../../../lib/client";
import { Product } from "../../components";
import { Info } from "../../components";
import { StarRating } from "../../components";

import { useStateContext } from "../../../context/StateContext";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const  toTitleCase = (str)=> {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


const ProductDetails = ({ product, products }) => {
const { image, name, details, price, sku, ingredients, weight, delivery, slug } = product;
const [index, setIndex] = useState(0);
const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

    const { asPath } = useRouter();
    let seoProductSlug = asPath.split("/")[2];
    let seoProductName = "";
    
    if (seoProductSlug != null) {
        seoProductName = seoProductSlug.replace(/-/g, " ");
        if (seoProductSlug === slug.current) {
            seoProductName = toTitleCase(seoProductSlug.replace(/-/g, " "));

            // Debug logs
            console.log("seoProductSlug:", seoProductSlug);
            console.log("slug.current:", slug?.current); // use ? to avoid crash if slug is undefined

        }
    }

const handleBuyNow = () => {
    onAdd(product, qty);
    setShowCart(true);
};

return (
<>
    <NextSeo
        title={`${toTitleCase(seoProductName)} - Macaron Magic1`}
        description="Great tasting home-made macarons1"
    />

<div>
    <div className="product-detail-container">
        <div>
            <div className="image-container">
                <img  src={urlFor(image && image[index])}  className="product-detail-image" />
            </div>

            <div className="small-images-container">
                {image?.map((item, i) => (
                <img  key={i}  src={urlFor(item)}  
                className={i === index ? "small-image selected-image" : "small-image"}
                onMouseEnter={() => setIndex(i)} />
                ))}
            </div>
        </div>
    
        <div className="product-detail-desc">
            <h1>{name}</h1>
            <div className="reviews">
                {/*<div>
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                    <AiOutlineStar />
                </div>*/}
                
                <StarRating />
                <p>(20)</p>
            </div>
            <h4>Details: </h4>
            <p>{details}</p>
            <p className="price">
                جنيه مصرى{price.toLocaleString("ar-EG", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
                })}
            </p>
            per box of 12
            <div className="quantity">
                <h3>Quantity:</h3>
                <p className="quantity-desc">
                    <span className="minus" onClick={decQty}>
                        <AiOutlineMinus />
                    </span>
                    <span className="num">{qty}</span>
                    <span className="plus" onClick={incQty}>
                        <AiOutlinePlus />
                    </span>
                </p>
            </div>
            <div className="sku">SKU: {sku}</div>
                <div className="buttons">
                    <button   type="button"  className="add-to-cart"  onClick={() => onAdd(product, qty)}                    >
                        Add to Cart
                    </button>
                    
                    {/* NEW BUTTON */}
                    <button className="button btn-cart" type="button" onClick={() => onAdd(product, qty)} >
                        <span>
                            <span>Add to My Bag</span>
                        </span>
                    </button>
                    
                    <button type="button" className="buy-now" onClick={handleBuyNow}>
                        Buy Now
                    </button>
                </div>
        </div>
    </div>

    <div className="maylike-products-wrapper">
        <Info ingredients={ingredients} weight={weight} delivery={delivery} />
        <h2>You may also like</h2>
        <div className="marquee">
            <div className="maylike-products-container track">
                {products.map((item) => (
                    <Product key={item._id} product={item} />
                ))}
            </div>
        </div>
    </div>
</div>
</>
);
};

export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
        slug {
        current
        }
        }
        `;

    const products = await client.fetch(query);
    const paths = products.map((product) => ({
        params: {
        slug: product.slug.current,
        },
        }));

    return {
        paths,
        fallback: "blocking",
    };
};

export const getStaticProps = async ({ params: { slug } }) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]';
    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery);

    return {
    props: { products, product },
    };
};

export default ProductDetails;
