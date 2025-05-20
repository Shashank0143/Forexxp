import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { useRef, useState } from 'react';

const ProductZoom = (props) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    const goto = (index) => {
        setSlideIndex(index);
        zoomSlider.current.swiper.slideTo(index);
        zoomSliderBig.current.swiper.slideTo(index);
    }


    return (
        <div className="productZoom">
            <div className='productZoom productZoomBig position-relative mb-3'>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={0}
                    navigation={false}
                    slidesPerGroup={1}
                    modules={[Navigation]}
                    className="zoomSliderBig"
                    ref={zoomSliderBig}
                >
                    {
                        props?.images?.map((img, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <div className='item'>
                                        <InnerImageZoom
                                            src={img} />
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }


                </Swiper>

            </div>
        </div>
    )
}

export default ProductZoom;