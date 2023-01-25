import { stripe } from "@/src/lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "@/src/styles/pages/product"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import Stripe from "stripe";
import Image from "next/image"
import Head from "next/head";
import axios from "axios";
import { useShoppingCart } from "@/src/hooks/useShoppingCart";

interface ProductProps {
    product: {
      id: string
      name: string
      imageUrl: string
      price: string
      description: string
      defaultPriceId: string
    }
  }
export default function Product({ product }: ProductProps) {
  const { isFallback } = useRouter();

  const { addToCart, checkIfItemAlreadyExists } = useShoppingCart();

  if (isFallback) {
    return <p>Loading...</p>;
  }

  const itemAlreadyInCart = checkIfItemAlreadyExists(product.id);

  return (
    <>
      <Head>
        <title>{`${product.name} | Ignite Shop`}</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button
            disabled={itemAlreadyInCart}
            onClick={() => addToCart(product)}
          >
            {itemAlreadyInCart
              ? "Produto já está no carrinho"
              : "Colocar na sacola"}
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
    return {
      paths: [
        {
          params: { id: 'prod_NCOiqhtQA1sJDS' }
        }
      ],
      fallback: 'blocking',
    }
  }
  
export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
    const productId = String(params?.id);
  
    const product = await stripe.products.retrieve(productId, {
      expand: ['default_price']
    });
  
    const price = product.default_price as Stripe.Price;
  
    return {
      props: {
        product: {
          id: product.id,
          name: product.name,
          imageUrl: product.images[0],
          price: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(Number(price.unit_amount) / 100),
          description: product.description,
          defaultPriceId: price.id
        }
      },
      revalidate: 60 * 60 * 1 // 1 hours
    }
  }