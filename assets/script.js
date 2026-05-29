(function () {
  var releaseRepo = "Larsvdx/novel-architect-releases";
  var latestReleaseUrl = "https://github.com/" + releaseRepo + "/releases/latest";
  var latestApiUrl = "https://api.github.com/repos/" + releaseRepo + "/releases/latest";

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("site-menu");

    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("is-open", !expanded);
    });
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return "";
    }

    var units = ["B", "KB", "MB", "GB"];
    var value = bytes;
    var index = 0;

    while (value >= 1024 && index < units.length - 1) {
      value = value / 1024;
      index += 1;
    }

    var precision = value >= 10 || index === 0 ? 0 : 1;
    return value.toFixed(precision) + " " + units[index];
  }

  function detectPlatform() {
    var platform = (navigator.platform || "").toLowerCase();
    var userAgent = (navigator.userAgent || "").toLowerCase();

    if (platform.indexOf("win") !== -1 || userAgent.indexOf("windows") !== -1) {
      return "windows";
    }

    if (platform.indexOf("mac") !== -1 || userAgent.indexOf("mac os") !== -1) {
      return "macos";
    }

    if (platform.indexOf("linux") !== -1 || userAgent.indexOf("linux") !== -1) {
      return "linux";
    }

    return "unknown";
  }

  function assetKind(name) {
    var lower = name.toLowerCase();

    if (lower.endsWith(".msi") || lower.endsWith(".exe")) {
      return "windows";
    }

    if (lower.endsWith(".dmg")) {
      return "macos";
    }

    if (lower.endsWith(".deb") || lower.endsWith(".appimage")) {
      return "linux";
    }

    if (lower.endsWith(".jar")) {
      return "java";
    }

    return "other";
  }

  function kindLabel(kind) {
    switch (kind) {
      case "windows":
        return "Windows installer";
      case "macos":
        return "macOS package";
      case "linux":
        return "Linux package";
      case "java":
        return "Portable Java build";
      default:
        return "Release asset";
    }
  }

  function preferredAsset(assets) {
    var platform = detectPlatform();
    var platformAsset = assets.find(function (asset) {
      return assetKind(asset.name) === platform;
    });

    if (platformAsset) {
      return platformAsset;
    }

    return assets.find(function (asset) {
      return assetKind(asset.name) !== "other";
    }) || assets[0];
  }

  function setPrimaryDownload(asset) {
    var links = document.querySelectorAll("[data-primary-download]");

    links.forEach(function (link) {
      if (asset && asset.browser_download_url) {
        var kind = assetKind(asset.name);
        link.href = asset.browser_download_url;
        link.textContent = "Download " + kindLabel(kind).toLowerCase();
      } else {
        link.href = latestReleaseUrl;
        link.textContent = "Download latest release";
      }
    });
  }

  function renderReleaseDetails(release) {
    var title = document.querySelector("[data-release-title]");
    var published = document.querySelector("[data-release-published]");

    if (title) {
      title.textContent = release.name || release.tag_name || "Latest release";
    }

    if (published && release.published_at) {
      var date = new Date(release.published_at);
      published.textContent = "Published " + date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
  }

  function renderAssets(assets) {
    var container = document.querySelector("[data-release-assets]");

    if (!container) {
      return;
    }

    container.textContent = "";

    if (!assets.length) {
      var empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No downloadable assets were found on the latest release. Open GitHub releases to inspect the release manually.";
      container.appendChild(empty);
      return;
    }

    var recommended = preferredAsset(assets);

    assets
      .slice()
      .sort(function (left, right) {
        return assetKind(left.name).localeCompare(assetKind(right.name)) || left.name.localeCompare(right.name);
      })
      .forEach(function (asset) {
        var kind = assetKind(asset.name);
        var link = document.createElement("a");
        var copy = document.createElement("span");
        var title = document.createElement("strong");
        var meta = document.createElement("span");

        link.className = "asset-link";
        link.href = asset.browser_download_url;
        title.textContent = kindLabel(kind);
        meta.textContent = asset.name + (asset.size ? " - " + formatBytes(asset.size) : "");
        copy.appendChild(title);
        copy.appendChild(meta);
        link.appendChild(copy);

        if (recommended && asset.name === recommended.name) {
          var badge = document.createElement("span");
          badge.className = "recommended-badge";
          badge.textContent = "Recommended";
          link.appendChild(badge);
        }

        container.appendChild(link);
      });
  }

  function renderFallback() {
    var title = document.querySelector("[data-release-title]");
    var published = document.querySelector("[data-release-published]");
    var container = document.querySelector("[data-release-assets]");

    if (title) {
      title.textContent = "Latest GitHub release";
    }

    if (published) {
      published.textContent = "Release details could not be loaded automatically.";
    }

    if (container) {
      container.textContent = "";
      var fallback = document.createElement("a");
      fallback.className = "asset-link";
      fallback.href = latestReleaseUrl;
      fallback.textContent = "Open the latest GitHub release";
      container.appendChild(fallback);
    }

    setPrimaryDownload(null);
  }

  function initLatestRelease() {
    setPrimaryDownload(null);

    fetch(latestApiUrl, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("GitHub release request failed");
        }

        return response.json();
      })
      .then(function (release) {
        var assets = Array.isArray(release.assets) ? release.assets : [];
        var recommended = preferredAsset(assets);
        renderReleaseDetails(release);
        renderAssets(assets);
        setPrimaryDownload(recommended);
      })
      .catch(renderFallback);
  }

  initNavigation();
  initLatestRelease();
})();
