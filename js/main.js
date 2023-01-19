const baseUrl = " http://43.201.103.199";
let postlist = [];
let postDetail;
let comments;

const getData = async () => {
  try {
    const response = await axios.get(`${baseUrl}/posts`);
    console.log(response.data.data.posts);
    postlist = response.data.data.posts;
  } catch (error) {
    console.log(error);
  }
};

const getDetailData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/post/${id}`);
    console.log(response);
    postDetail = response.data.data.post;
    comments = response.data.data.comments;
  } catch (error) {
    console.log(error);
  }
};

const postData = async (payload) => {
  try {
    const response = await axios.post(`${baseUrl}/post`, payload);
    console.log(response);
    alert("포스트 성공!");
    window.location.href = "http://127.0.0.1:5500/index.html";
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/post/${id}`);
    console.log(response);
    if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
      window.location.href = "http://127.0.0.1:5500/index.html";
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteComment = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/comment/${id}`);
    console.log(response);
    alert("댓글 삭제 완료");
  } catch (error) {
    console.log(error);
  }
};

getData();

let title;
let content;

const renderPage = async () => {
  console.log("변경");
  await getData();
  const hash = window.location.hash.replace("#", "");
  console.log("주소", hash == "");
  const mainPage = document.getElementById("root");

  //! ------------ 상세페이지는 hash값이 넘버일때만 --------------------
  if (Number(hash)) {
    console.log("디테일페이지");
    await getDetailData(hash);
    console.log(postDetail);
    mainPage.innerHTML = `
    <div id="root"> 
    <div class="header">Happy New Year 2023</div>
    <div
    class="detailCtn"
    ><Img 
    class="detailImg"
    src=${postDetail.image}/>
    <div
    class="contentWrap"
    ><div
    class="postTitle"
    >${postDetail.title}</div>
    <div>${postDetail.createdAt}</div>
    <div
    class="postContentBox"
    >${postDetail.content}</div>
    <div
    class="buttonDiv"
    >    <button
    id="postDeleteBtn"
    class ="postDeleteBtn"
    >삭제</button></div>

    </div>
    <div
    class="commentWrap"
    id='commentList'
    >
    </div>
    </div></div>
    </div>
    
    </div>
    `;

    const deletBtn = document.getElementById("postDeleteBtn");

    deletBtn.addEventListener("click", () => {
      deletePost(hash);
    });

    //? ------- 상세페이지에 댓글들 뿌려주는 작업  --------------
    if (comments.length === 0) {
      let commentCtn = document.createElement("div");
      commentCtn.innerText = "댓글이 없습니다";
      document.getElementById("commentList").appendChild(commentCtn);
    } else {
      let commentCtn = document.createElement("div");
      commentCtn.classList.add("commentCtn");
      comments.map((comment) => {
        let commentBox = document.createElement("div");
        let commentDeleteBtn = document.createElement("button");
        commentDeleteBtn.classList.add("commentDeleteBtn");
        commentDeleteBtn.id = `${comment.commentId}`;
        commentBox.setAttribute("id", comment.commentId);
        commentBox.setAttribute("class", "commentBox");
        commentDeleteBtn.addEventListener("click", (e) => {
          deleteComment(e.target.id);
        });
        commentBox.innerText = comment.content;
        commentDeleteBtn.innerText = "삭제";
        commentBox.appendChild(commentDeleteBtn);
        commentCtn.appendChild(commentBox);
        document.getElementById("commentList").appendChild(commentCtn);
      });
    }
  } else if (hash == "postPage") {
    mainPage.innerHTML = `
    <div
    class="postPageCtn"
    ><h1
    class="postPageTitle"
    >새해 인사 한마디 적고가시지요..</h1>
    <h2
    class="inputTitle"
    >제목</h1>
    <input
    placeholder="글 제목을 입력해주세요"
    onchange="titleChange(this)"
    />
    <h2
    class="inputTitle"
    >내용</h2>
    <input
    placeholder="글 내용을 입력해주세요"
    class="contentInput"
    onchange="contentChange(this)"
    />
    <button 
    class="postBtn"
    onclick='postClickEvent()' >등록하기</button></div>
    `;
  } else {
    mainPage.innerHTML = `
    <div id="root">
    <div class="header">Happy New Year 2023</div>
    <div class="postBtn" id="postPage">새 글 작성하기</div>
    <ul id="postlist"></ul>
  </div>
    `;
    //? ------- 메인페이지에 포스트목록 뿌려주는 작업  --------------
    let postTemplate = document.createElement("div");
    postTemplate.classList.add("postListBox");
    postlist.map((post) => {
      let Img = document.createElement("img");
      Img.classList.add("postListImg");
      Img.src = post.image;
      let postBox = document.createElement("div");
      postBox.setAttribute("id", post.postId);
      postBox.setAttribute("class", "postBox");
      postBox.addEventListener("click", (e) => {
        console.log(e.target);
        location.href = location.origin + location.pathname + "#" + e.target.id;
      });
      postBox.innerText = post.title;
      postBox.appendChild(Img);
      postTemplate.append(postBox);
    });

    document.getElementById("postlist").append(postTemplate);
    document.getElementById("postPage").addEventListener("click", (e) => {
      console.log(e.target);
      location.href = location.origin + location.pathname + "#" + e.target.id;
      console.log(location.hash.substring(1));
    });
  }
};

const contentChange = (e) => {
  console.log(e.value);
  title = e.value;
};

const titleChange = (e) => {
  console.log(e.value);
  content = e.value;
};

const postClickEvent = () => {
  postData({
    title: title,
    content: content,
    image:
      "https://img.freepik.com/premium-photo/small-tricolor-kitten-meows-floorroom_457211-10960.jpg?w=1060",
  });

  console.log("글쓰기");
  console.log(content);
  console.log(title);
};

window.addEventListener("hashchange", renderPage);

window.addEventListener("DOMContentLoaded", renderPage);
