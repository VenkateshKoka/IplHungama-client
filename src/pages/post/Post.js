import React, {useState, useContext, useEffect, Fragment} from "react";
import {toast} from "react-toastify";
import {AuthContext} from "../../context/authContext";
import {useQuery, useMutation} from '@apollo/react-hooks';
import omitDeep from 'omit-deep';
import FileUpload from "../../components/FileUpload";
import {POST_CREATE, POST_DELETE} from "../../graphql/mutations";
import {POSTS_BY_USER} from "../../graphql/queries";
import PostCard from "../../components/PostCard";

const initialState = {
    content:'',
    image: {
        url:'https://via.placeholder.com/200x200.png?text=Post',
        public_id: '123'
    }
};

const Post = () => {
    const [values, setValues] = useState(initialState);
    const [loading, setLoading] = useState(false);

    // query

    const {data: posts} = useQuery(POSTS_BY_USER);

    // destructure
    const {content, image} = values;

    // mutation
    const [postCreate] = useMutation(POST_CREATE, {
        // update cache
        update: (cache,{data: {postCreate}}) => {
            // readQuery( for existing posts by user already) from cache
            const {postsByUser} = cache.readQuery({
                query: POSTS_BY_USER
            })
            // writeQuery to append the new created post with existing posts in cache
            cache.writeQuery({
                query: POSTS_BY_USER,
                data: {
                    postsByUser: [postCreate, ...postsByUser]
                }
            })
        },
        onError: (error) => console.log(error)
    });

    const [postDelete] = useMutation(POST_DELETE , {
        // update cache
        update: ({data}) => {
            console.log('POST DELETE MUTATION', data)
            toast.error('Post Deleted')
        },
        onError: (error) => {
            console.log(error);
            toast.error('Post delete failed');
        }
    });

    const handleDelete = async (postId) => {
        let answer = window.confirm('Delete the post ?');
        if (answer) {
            setLoading(true);
            await postDelete({
                variables : {postId: postId},
                refetchQueries: [{query: POSTS_BY_USER}]
            });
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await postCreate({variables : {input: values}});
        setValues(initialState);
        setLoading(false);
        toast.success('Post created!!');
    }

    const handleChange = e => {
        e.preventDefault();
        setValues({...values, [e.target.name]:e.target.value})
    }

    const createForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
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
            {loading ? <h4 className="text-danger">Loading</h4> : <h4>Create </h4>}
            <FileUpload
                values={values}
                setValues={setValues}
                loading={loading}
                setLoading={setLoading}
                singleUpload={true}
            />
            <div className="row">
                <div className="col">
                    {createForm()}
                </div>
            </div>
            <hr/>
            <div className="row p-5">
                {posts && posts.postsByUser.map(post => (
                    <div key={post._id} className="col-md-4 pt-5">
                        <PostCard
                            post={post}
                            handleDelete={handleDelete}
                            showUpdateButton={true}
                            showDeleteButton={true}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Post;