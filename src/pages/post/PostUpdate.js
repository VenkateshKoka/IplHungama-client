import React, {useState, useMemo, useEffect} from "react";
import {toast} from "react-toastify";
import {AuthContext} from "../../context/authContext";
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {SINGLE_POST} from "../../graphql/queries";
import {POST_UPDATE} from "../../graphql/mutations";
import omitDeep from "omit-deep";
import { useParams } from "react-router-dom";
import FileUpload from "../../components/FileUpload";

const PostUpdate = () => {
    const [values, setValues] = useState({
        content:'',
        image: {
            url: '',
            public_id: ''
        }
    });
    const [getSinglePost, {data: singlePost}] = useLazyQuery(SINGLE_POST);
    const [postUpdate] = useMutation(POST_UPDATE);
    const [loading, setLoading] = useState(false);
    const {content, image} = values;
    const params = useParams()

    useMemo(() => {
        if(singlePost) {
            setValues({
                ...values,
                _id: singlePost.singlePost._id,
                content: singlePost.singlePost.content,
                image: omitDeep(singlePost.singlePost.image, ['__typename'])
            })
        }
    }, [singlePost]);

    useEffect(() => {
        getSinglePost({variables: {postId: params.postid}})
    }, []);

    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        postUpdate({variables:{input: values}});
        setLoading(false);
        toast.success('Post updated');

    }

    const updateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <FileUpload
                    values={values}
                    setValues={setValues}
                    loading={loading}
                    setLoading={setLoading}
                    singleUpload={true}
                />
                <textarea
                    name="content"
                    value={content}
                    onChange={handleChange}
                    rows="10"
                    className="md-textarea form-control"
                    placeholder="write something cool"
                    maxLength={420}
                    disabled={loading}
                >
                </textarea>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading || !content}>
                Post
            </button>
        </form>
    )

    return (
        <div className="container p-5">
            {loading ? <h4 className="text-danger">Loading</h4> : <h4>Update</h4>}
            {updateForm()}
        </div>
    )
}

export default PostUpdate;