
const ACCESS_KEY = "cSyQuFGH04s3bxOZYXcHdp85c9e6eGyxZGcTRfpfkT76zOTIAfOjh2Qo";
const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");

let keyword = "";
let page = 1;

async function searchImages(append = false) {
  if (!append) {
    searchResult.innerHTML = "";
    if (showMoreBtn) showMoreBtn.style.display = "none";
  }

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&page=${page}&per_page=12`;
    const response = await fetch(url, {
      headers: {
        Authorization: ACCESS_KEY
      }
    });

    if (!response.ok) throw new Error(`API error ${response.status}`);

    const data = await response.json();

    if (data.photos.length === 0 && page === 1) {
      searchResult.innerHTML = `<p>No images found for "${keyword}".</p>`;
      return;
    }

    data.photos.forEach((photo) => {
      const imageLink = document.createElement("a");
      imageLink.href = photo.url;
      imageLink.target = "_blank";
      imageLink.rel = "noopener noreferrer";

      const image = document.createElement("img");
      image.src = photo.src.medium;
      image.alt = photo.alt || keyword;
      image.loading = "lazy";
      image.style.cssText = "width:100%; height:200px; object-fit:cover; display:block;";

      imageLink.appendChild(image);
      searchResult.appendChild(imageLink);
    });

    if (showMoreBtn) {
      showMoreBtn.style.display = data.next_page ? "block" : "none";
    }

  } catch (err) {
    searchResult.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    console.error(err);
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  keyword = searchBox.value.trim();
  if (!keyword) return;
  page = 1;
  searchImages(false);
});

if (showMoreBtn) {
  showMoreBtn.addEventListener("click", () => {
    page++;
    searchImages(true);
  });
}