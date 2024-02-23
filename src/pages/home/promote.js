import { Carousel } from "@material-tailwind/react";

const Promote = ({ productListOriginal }) => {
  return (
    <Carousel className="rounded-xl">
      {productListOriginal.map((item, index) => {
        if( index <=2 ){
            return (<img
                key={"bb"+index}
                src={item?.product_img || "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80"}
                alt="image 1"
                className="h-full w-full object-cover"
              />)
        }else{
            <></>
        }
        
      })}
    </Carousel>
  );
};

export default Promote;
