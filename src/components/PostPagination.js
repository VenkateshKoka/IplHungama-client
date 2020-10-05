import React from "react";

const PostPagination = ({page, setPage, postCount}) => {
    let totalPages;
    const pagination = () => {
        totalPages = Math.min(Math.ceil(postCount && postCount.totalPosts / 3), 10);
        let pages = [];
        for (let i=1; i <= totalPages; i++) {
            pages.push(
                <li  key={i}>
                    <a className={`page-link ${page === i && 'activePagination'}`} onClick={() => setPage(i)} >{i}</a>
                </li>
            );
        }
        return pages;
    };

    return (
        <nav>
            <ul className="pagination justify-content-center">
                <li>
                    <a className={`page-link ${page === 1 && 'disabled'}`} onClick={() => page>1 && setPage(page-1)} >Previous</a>
                </li>
                {pagination()}
                <li>
                    <a className={`page-link ${page === totalPages && 'disabled'}`} onClick={() => page < totalPages && setPage(page+1)} >Next</a>
                </li>
            </ul>
        </nav>
    )
};

export default PostPagination;