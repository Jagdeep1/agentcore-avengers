/**
 * Copy Code Button Functionality
 * Adds copy-to-clipboard functionality for all code blocks
 */

function initCopyButtons() {
  const buttons = document.querySelectorAll('.copy-button');

  buttons.forEach((button) => {
    // Remove existing event listeners to prevent duplicates
    const newButton = button.cloneNode(true);
    button.parentNode?.replaceChild(newButton, button);

    newButton.addEventListener('click', async () => {
      const codeId = newButton.getAttribute('data-code-id');
      const codeBlock = document.getElementById(codeId);

      if (!codeBlock) return;

      const code = codeBlock.textContent || '';

      try {
        await navigator.clipboard.writeText(code);

        // Visual feedback - switch icons
        const copyIcon = newButton.querySelector('.copy-icon');
        const checkIcon = newButton.querySelector('.check-icon');

        if (copyIcon) copyIcon.classList.add('hidden');
        if (checkIcon) checkIcon.classList.remove('hidden');
        newButton.classList.add('copied');

        // Reset after 2 seconds
        setTimeout(() => {
          if (copyIcon) copyIcon.classList.remove('hidden');
          if (checkIcon) checkIcon.classList.add('hidden');
          newButton.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    });
  });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCopyButtons);
} else {
  initCopyButtons();
}

// Re-initialize after page transitions (for view transitions or SPA navigation)
document.addEventListener('astro:page-load', initCopyButtons);
