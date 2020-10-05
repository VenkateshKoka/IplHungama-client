import React, {useContext, Fragment} from "react";
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import {AuthContext} from "../context/authContext";
import Image from "./Image";

const FileUpload = ({values, setValues, loading, setLoading, singleUpload = false}) => {

    const {state} = useContext(AuthContext);

    const fileResizeAndUpload = (event) => {
        setLoading(true);
        let fileInput = false;
        if(event.target.files[0]) {
            fileInput = true
        }
        if(fileInput) {
            Resizer.imageFileResizer(
                event.target.files[0],
                300,
                300,
                'JPEG',
                100,
                0,
                uri => {
                    console.log(uri)
                    axios.post(`${process.env.REACT_APP_REST_ENDPOINT}/uploadimages`,
                        {image: uri},
                        {
                            headers: {
                                authtoken: state.user.token
                            }
                        })
                        .then(response => {
                            setLoading(false);
                            // setValues to parent component based on either it is used for single/multiple upload
                            // of images
                            if (singleUpload) {
                                const {image} = values;
                                setValues({...values, image: response.data});
                            } else {
                                const {images} = values;
                                setValues({...values, images: [...images, response.data]});
                            }
                        })
                        .catch(error => {
                            setLoading(false)
                            console.log('CLOUDINARY IMAGE UPLOAD FAILED', error);
                        })
                },
                'base64'
            );
        }
    }

    const handleImageRemove = (id) => {
        setLoading(true);
        axios.post(`${process.env.REACT_APP_REST_ENDPOINT}/removeimage`, {
            public_id: id
        },{
            headers: {
                authtoken: state.user.token
            }
        }).then(response => {
            setLoading(false);
            // setValues to parent component based on either it is used for single/multiple upload
            // of images
            if(singleUpload) {
                const {image} = values;
                setValues({
                    ...values,
                    image: {
                        url: '',
                        public_id: ''
                    }
                });
            } else {
                const {images} = values;
                let filteredImages = images.filter(image => {
                    return image.public_id !== id
                });
                setValues({...values, images: filteredImages});
            }
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });
    }

    return(
        <div className="row">
            <div className="col-md-3">
                <label className="btn btn-primary">Upload Image
                    <input hidden
                           type="file"
                           accept="image/*"
                           name="image"
                           className="form-control"
                           placeholder="Image"
                           disabled={loading}
                           onChange={fileResizeAndUpload}/>
                </label>
            </div>
            <div className="col-md-9">
                {/* for single image*/}
                {values.image && <Image image={values.image} key={values.image.public_id} handleImageRemove={handleImageRemove}/>}
                {/* for multiple images*/}
                {values.images && values.images.map((image) => (
                    <Image image={image} key={image.public_id} handleImageRemove={handleImageRemove}/>
                ))}
            </div>
        </div>

    );
}

export default FileUpload;