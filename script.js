const copyButton = document.querySelector("#copy-link");

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copyButton.innerHTML = '<span aria-hidden="true">+</span> link copied';
  } catch {
    copyButton.innerHTML = '<span aria-hidden="true">+</span> copy unavailable';
  }
});