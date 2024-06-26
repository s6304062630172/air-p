import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
const Typeproduct = ({ product, onShowModal }) => { //ส่ง Productlist เข้ามาเเต่ละตัว เพื่อนลูปในการแสดง product
  return (
    <Card className="w-full max-w-[26rem] shadow-lg bg-gray-200 mb-5">
      <CardHeader floated={false} color="blue-gray">
        <img
          src={product?.product_img}
          alt="ui/ux review check"
        />
        <div className="to-bg-black-10 absolute h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />

      </CardHeader>
      <CardBody>
        <div className="mb-3 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray" className="font-medium">
            {product?.product_name}
            <Typography variant="h5" color="blue-gray" className="font-medium">
              BTU : {product?.product_btu}
            </Typography>
          </Typography>

          <Typography
            color="blue-gray"
            className="flex items-center gap-1.5 font-normal"
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="-mt-0.5 h-5 w-5 text-yellow-700"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>

            จำนวน<br></br>
            {product?.product_quantity}
          </Typography>
        </div>

        <Typography color="gray">
          {product?.product_detail.split(" -").join("<br>-")}
        </Typography>
        <div className="mt-3 mb-5 pb-10">
          <span>ราคา &nbsp;</span>
          <span className="text-2xl font-bold">
            {product?.product_price.toLocaleString()}
          </span>
          <span>&nbsp;บาท</span>
        </div>
      </CardBody>
      <CardFooter className="pt-3 bottom-0 left-0 absolute w-full pt-10">
        <Button
          size="lg"
          fullWidth={true}
          className=""
          onClick={() => onShowModal(product)}
        >
          สั่งซื้อสินค้า
        </Button>
      </CardFooter>
    </Card>
  );
};
export default Typeproduct;
