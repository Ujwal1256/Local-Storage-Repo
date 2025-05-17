  
      // --- State ---
      let memes = [];
      let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      let search = localStorage.getItem("search") || "";
      let sort = localStorage.getItem("sort") || "name-asc";
      let showFavsOnly = localStorage.getItem("showFavsOnly") === "true";

      // --- Elements ---
      const fetchBtn = document.getElementById("fetchBtn");
      const grid = document.getElementById("grid");
      const searchInput = document.getElementById("searchInput");
      const sortSelect = document.getElementById("sortSelect");
      const showFavsOnlyCheckbox = document.getElementById("showFavsOnly");

      // --- UI State Sync ---
      searchInput.value = search;
      sortSelect.value = sort;
      showFavsOnlyCheckbox.checked = showFavsOnly;

      // --- Fetch Memes ---
      fetchBtn.addEventListener("click", async () => {
        fetchBtn.disabled = true;
        fetchBtn.textContent = "Loading...";
        try {
          const res = await fetch("https://api.imgflip.com/get_memes");
          const data = await res.json();
          memes = data.data.memes;
          render();
        } catch (e) {
          alert("Failed to fetch memes.");
        }
        fetchBtn.disabled = false;
        fetchBtn.textContent = "Fetch Memes";
      });

      // --- Render Function ---
      function render() {
        let filtered = memes;

        // Search
        if (search.trim()) {
          filtered = filtered.filter((m) =>
            m.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Show Favorites Only
        if (showFavsOnly) {
          filtered = filtered.filter((m) => favorites.includes(m.id));
        }

        // Sort
        filtered = filtered.slice();
        switch (sort) {
          case "name-asc":
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "name-desc":
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case "width-asc":
            filtered.sort((a, b) => a.width - b.width);
            break;
          case "width-desc":
            filtered.sort((a, b) => b.width - a.width);
            break;
          case "height-asc":
            filtered.sort((a, b) => a.height - b.height);
            break;
          case "height-desc":
            filtered.sort((a, b) => b.height - a.height);
            break;
        }

        // Render
        grid.innerHTML = "";
        if (filtered.length === 0) {
          grid.innerHTML =
            '<p style="grid-column:1/-1;text-align:center;">No memes found.</p>';
          return;
        }
        for (const meme of filtered) {
          const isFav = favorites.includes(meme.id);
          const card = document.createElement("div");
          card.className = "meme-card" + (isFav ? " favorite" : "");
          card.innerHTML = `
                    ${isFav ? '<span class="badge">★ Favorite</span>' : ""}
                    <img src="${meme.url}" alt="${meme.name}">
                    <div class="meme-title">${meme.name}</div>
                    <div class="meme-info">W: ${meme.width} | H: ${
            meme.height
          }</div>
                    <button class="fav-btn${
                      isFav ? " favorited" : ""
                    }" data-id="${meme.id}">
                        ${isFav ? "Remove Favorite" : "Add to Favorites"}
                    </button>
                `;
          grid.appendChild(card);
        }
        // Add event listeners for favorite buttons
        document.querySelectorAll(".fav-btn").forEach((btn) => {
          btn.onclick = () => {
            const id = btn.getAttribute("data-id");
            toggleFavorite(id);
          };
        });
      }

      // --- Favorite Toggle ---
      function toggleFavorite(id) {
        if (favorites.includes(id)) {
          favorites = favorites.filter((f) => f !== id);
        } else {
          favorites.push(id);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
        render();
      }

      // --- Search ---
      searchInput.addEventListener("input", (e) => {
        search = e.target.value;
        localStorage.setItem("search", search);
        render();
      });

      // --- Sort ---
      sortSelect.addEventListener("change", (e) => {
        sort = e.target.value;
        localStorage.setItem("sort", sort);
        render();
      });

      // --- Show Favorites Only ---
      showFavsOnlyCheckbox.addEventListener("change", (e) => {
        showFavsOnly = e.target.checked;
        localStorage.setItem("showFavsOnly", showFavsOnly);
        render();
      });

      // --- On Load: If memes already fetched, render them ---
      if (memes.length > 0) render();

      // --- On Load: If memes in session, persist (optional) ---
      // (You could persist memes in localStorage for offline, but not required.)

      // --- On Load: If user reloads, keep UI state ---
      // (Handled above via localStorage.)
    