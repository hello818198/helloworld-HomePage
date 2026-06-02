document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("memoInput");
  const createButton = document.getElementById("createButton");
  const container = document.getElementById("memoContainer");

  if (!input || !createButton || !container) {
    return;
  }

  const memos = JSON.parse(localStorage.getItem("memos") || "[]");
  let editingIndex = null;

  const saveMemos = () => {
    localStorage.setItem("memos", JSON.stringify(memos));
  };

  const renderMemos = () => {
    container.innerHTML = "";
    memos.forEach((memo, index) => {
      const card = document.createElement("div");
      card.className = "memo-card";

      const textDiv = document.createElement("div");
      textDiv.className = "memo-card-text";

      const textarea = document.createElement("textarea");
      textarea.className = "memo-card-textarea";
      textarea.value = memo;
      textarea.style.display = "none";
      textarea.rows = 6;

      if (editingIndex === index) {
        textDiv.textContent = "";
        textarea.style.display = "block";
      } else {
        textDiv.textContent = memo;
      }

      const buttonsDiv = document.createElement("div");
      buttonsDiv.className = "memo-card-buttons";

      const viewButton = document.createElement("button");
      viewButton.className = "button memo-view-button";
      viewButton.textContent = "表示";
      viewButton.addEventListener("click", () => openMemoWindow(index));

      const editButton = document.createElement("button");
      editButton.className = "button memo-edit-button";
      editButton.textContent = editingIndex === index ? "保存" : "編集";
      editButton.addEventListener("click", () => {
        if (editingIndex === index) {
          const value = textarea.value.trim();
          if (value.length === 0) {
            alert("メモを入力してください。");
            return;
          }
          memos[index] = value;
          saveMemos();
          editingIndex = null;
          renderMemos();
        } else {
          editingIndex = index;
          renderMemos();
        }
      });

      const cancelButton = document.createElement("button");
      cancelButton.className = "button memo-cancel-button";
      cancelButton.textContent = "キャンセル";
      cancelButton.style.display = editingIndex === index ? "inline-flex" : "none";
      cancelButton.addEventListener("click", () => {
        editingIndex = null;
        renderMemos();
      });

      const deleteButton = document.createElement("button");
      deleteButton.className = "button memo-delete-button";
      deleteButton.textContent = "消去";
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteMemo(index);
      });

      buttonsDiv.appendChild(viewButton);
      buttonsDiv.appendChild(editButton);
      buttonsDiv.appendChild(cancelButton);
      buttonsDiv.appendChild(deleteButton);

      card.appendChild(textDiv);
      card.appendChild(textarea);
      card.appendChild(buttonsDiv);
      container.appendChild(card);
    });
  };

  const openMemoWindow = (index) => {
    const windowWidth = 620;
    const windowHeight = 520;
    const left = window.screenX + (window.outerWidth - windowWidth) / 2;
    const top = window.screenY + (window.outerHeight - windowHeight) / 2;
    window.open(
      `/memo-window?index=${index}`,
      `memo_${index}`,
      `width=${windowWidth},height=${windowHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  const deleteMemo = (index) => {
    if (confirm("このメモを削除しますか？")) {
      memos.splice(index, 1);
      saveMemos();
      if (editingIndex === index) {
        editingIndex = null;
      }
      renderMemos();
    }
  };

  createButton.addEventListener("click", () => {
    const text = input.value.trim();
    if (text.length === 0) {
      alert("メモを入力してください。");
      return;
    }
    memos.unshift(text);
    saveMemos();
    renderMemos();
    input.value = "";
    input.focus();
  });

  input.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      createButton.click();
    }
  });

  window.addEventListener("message", (event) => {
    if (!event.data || event.data.type !== "memoChanged") {
      return;
    }
    const { index, content } = event.data;
    if (Number.isFinite(index) && index >= 0 && index < memos.length) {
      memos[index] = content;
      saveMemos();
      renderMemos();
    }
  });

  renderMemos();
});
