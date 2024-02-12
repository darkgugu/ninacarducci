function mauGallery(element, options) {
  options = Object.assign({}, mauGallery.defaults, options);
  var tagsCollection = [];

  function createRowWrapper(element) {
    if (!element.firstElementChild.classList.contains("row")) {
      var rowWrapper = document.createElement("div");
      rowWrapper.classList.add("gallery-items-row", "row");
      element.appendChild(rowWrapper);
    }
  }

  function wrapItemInColumn(element, columns) {
    var columnWrapper = document.createElement("div");
    columnWrapper.classList.add("item-column", "mb-4");

    if (columns.constructor === Number) {
        columnWrapper.classList.add(`col-${Math.ceil(12 / columns)}`);
    } else if (columns.constructor === Object) {
        if (columns.xs) columnWrapper.classList.add(`col-${Math.ceil(12 / columns.xs)}`);
        if (columns.sm) columnWrapper.classList.add(`col-sm-${Math.ceil(12 / columns.sm)}`);
        if (columns.md) columnWrapper.classList.add(`col-md-${Math.ceil(12 / columns.md)}`);
        if (columns.lg) columnWrapper.classList.add(`col-lg-${Math.ceil(12 / columns.lg)}`);
        if (columns.xl) columnWrapper.classList.add(`col-xl-${Math.ceil(12 / columns.xl)}`);
    } else {
        console.error(
            `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
        return;
    }

    element.parentNode.replaceChild(columnWrapper, element);
    columnWrapper.appendChild(element);
}

  function moveItemInRowWrapper(element) {
    var rowWrapper = document.querySelector(".gallery-items-row");
    rowWrapper.appendChild(element);
  }

  function responsiveImageItem(element) {
    if (element.tagName === "IMG") {
      element.classList.add("img-fluid");
    }
  }

  function openLightBox(element, lightboxId) {
    var lightbox = document.getElementById(lightboxId || "galleryLightbox");
    var modal = new bootstrap.Modal(lightbox);
  
    modal.show();
  
    var lightboxImage = lightbox.querySelector(".lightboxImage");
    lightboxImage.src = element.src;
  }

  function prevImage() {
    let activeImage = null;
    document.querySelectorAll("img.gallery-item").forEach(function (img) {
      if (img.src === document.querySelector(".lightboxImage").src) {
        activeImage = img;
      }
    });
    let activeTag = document.querySelector(".tags-bar span.active-tag").dataset.imagesToggle;
    let imagesCollection = [];
    if (activeTag === "all") {
      document.querySelectorAll(".item-column img").forEach(function (img) {
        imagesCollection.push(img);
      });
    } else {
      document.querySelectorAll(".item-column img").forEach(function (img) {
        if (img.dataset.galleryTag === activeTag) {
          imagesCollection.push(img);
        }
      });
    }
    let index = 0,
      next = null;

    imagesCollection.forEach(function (img, i) {
      if (activeImage.src === img.src) {
        index = i - 1;
      }
    });
    next = imagesCollection[index] || imagesCollection[imagesCollection.length - 1];
    document.querySelector(".lightboxImage").src = next.src;
  }

  function nextImage() {
    let activeImage = null;
    document.querySelectorAll("img.gallery-item").forEach(function (img) {
      if (img.src === document.querySelector(".lightboxImage").src) {
        activeImage = img;
      }
    });
    let activeTag = document.querySelector(".tags-bar span.active-tag").dataset.imagesToggle;
    let imagesCollection = [];
    if (activeTag === "all") {
      document.querySelectorAll(".item-column img").forEach(function (img) {
        imagesCollection.push(img);
      });
    } else {
      document.querySelectorAll(".item-column img").forEach(function (img) {
        if (img.dataset.galleryTag === activeTag) {
          imagesCollection.push(img);
        }
      });
    }
    let index = 0,
      next = null;

    imagesCollection.forEach(function (img, i) {
      if (activeImage.src === img.src) {
        index = i + 1;
      }
    });
    next = imagesCollection[index] || imagesCollection[0];
    document.querySelector(".lightboxImage").src = next.src;
  }

  function createLightBox(gallery, lightboxId, navigation) {
    gallery.insertAdjacentHTML("beforeend", `<dialog class="modal fade" id="${lightboxId || "galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            ${navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>' : '<span style="display:none;" />'}
            <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
            ${navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>' : '<span style="display:none;" />'}
          </div>
        </div>
      </dialog>
    </div>`);
  }

  function showItemTags(gallery, position, tags) {
    var tagItems =
      '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
    tags.forEach(function (value) {
      tagItems += `<li class="nav-item active">
        <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
    });
    var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

    if (position === "bottom") {
      gallery.insertAdjacentHTML("beforeend", tagsRow);
    } else if (position === "top") {
      gallery.insertAdjacentHTML("afterbegin", tagsRow);
    } else {
      console.error(`Unknown tags position: ${position}`);
    }
  }

  function filterByTag() {
    if (this.classList.contains("active-tag")) {
      return;
    }
    document.querySelector(".active.active-tag").classList.remove("active", "active-tag");
    this.classList.add("active-tag", "active");

    var tag = this.dataset.imagesToggle;

    document.querySelectorAll(".gallery-item").forEach(function (item) {
      item.closest(".item-column").style.display = "none";
      if (tag === "all" || item.dataset.galleryTag === tag) {
        item.closest(".item-column").style.display = "block";
      }
    });
  }

  createRowWrapper(element);

  if (options.lightBox) {
    createLightBox(element, options.lightboxId, options.navigation);
  }

  element.querySelectorAll(".gallery-item").forEach(function (item) {
    responsiveImageItem(item);
    moveItemInRowWrapper(item);
    wrapItemInColumn(item, options.columns);
    var theTag = item.dataset.galleryTag;
    if (options.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
      tagsCollection.push(theTag);
    }
  });

  if (options.showTags) {
    showItemTags(element, options.tagsPosition, tagsCollection);
  }

  element.style.opacity = 1;

  var galleryItems = element.querySelectorAll('.gallery-item')

  for (let i = 0; i < galleryItems.length; i++) {
    galleryItems[i].addEventListener("click", function (event) {
      var target = event.target;
      if (options.lightBox && target.tagName === "IMG") {
        openLightBox(target, options.lightboxId);
      }
    });
    
  }
  


  element.addEventListener("click", function (event) {
    var target = event.target;
    if (target.classList.contains("nav-link")) {
      filterByTag.call(target);
    } else if (target.classList.contains("mg-prev")) {
      prevImage();
    } else if (target.classList.contains("mg-next")) {
      nextImage();
    }
  });
}

mauGallery.defaults = {
  columns: 3,
  lightBox: true,
  lightboxId: null,
  showTags: true,
  tagsPosition: "bottom",
  navigation: true
};
