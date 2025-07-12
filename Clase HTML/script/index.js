document.addEventListener('DOMContentLoaded', function() {
      // Navigation active state
      const navLinks = document.querySelectorAll('.nav-link');
      const sections = document.querySelectorAll('section');
      
      // Smooth scrolling
      navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetSection = document.querySelector(targetId);
          
          window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
          });
          
          // Update active nav link
          navLinks.forEach(navLink => navLink.classList.remove('active'));
          this.classList.add('active');
        });
      });
      
      // Update active nav on scroll
      window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
          }
        });
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
      });
      
      // Profile Picture Upload
      const profileUpload = document.getElementById('profileUpload');
      const profileInput = document.getElementById('profileInput');
      const profileImg = document.getElementById('profileImg');
      const profilePlaceholder = document.getElementById('profilePlaceholder');
      
      profileUpload.addEventListener('click', function() {
        profileInput.click();
      });
      
      profileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            profileImg.src = e.target.result;
            profileImg.style.display = 'block';
            profilePlaceholder.style.display = 'none';
          };
          
          reader.readAsDataURL(this.files[0]);
        }
      });
      
      // Project Category Filter
      const categoryFilter = document.getElementById('categoryFilter');
      const projectCards = document.querySelectorAll('.project-card');
      
      categoryFilter.addEventListener('change', function() {
        const category = this.value;
        
        projectCards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
      
      // Blog Functionality
      const blogList = document.getElementById('blogList');
      const newPostBtn = document.getElementById('newPostBtn');
      const blogModal = document.getElementById('blogModal');
      const closeModal = document.getElementById('closeModal');
      const postTitle = document.getElementById('postTitle');
      const saveDraftBtn = document.getElementById('saveDraftBtn');
      const publishBtn = document.getElementById('publishBtn');
      
      // Initialize Quill editor
      const quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Write your blog post here...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['link', 'image'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      });
      
      // Load posts from localStorage
      function loadBlogPosts() {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        blogList.innerHTML = '';
        
        if (posts.length === 0) {
          blogList.innerHTML = '<p>No blog posts yet. Click "New Post" to create one.</p>';
          return;
        }
        
        posts.forEach(post => {
          const postEl = document.createElement('div');
          postEl.classList.add('blog-post');
          
          let titleHtml = `<h3 class="blog-title">${post.title}`;
          if (post.isDraft) {
            titleHtml += `<span class="draft-label">Draft</span>`;
          }
          titleHtml += `</h3>`;
          
          postEl.innerHTML = `
            ${titleHtml}
            <div class="blog-summary">${post.content.substring(0, 150)}...</div>
            <a href="javascript:void(0)" class="read-more">Read More</a>
          `;
          
          blogList.appendChild(postEl);
        });
      }
      
      // Show blog modal
      newPostBtn.addEventListener('click', function() {
        postTitle.value = '';
        quill.root.innerHTML = '';
        blogModal.style.display = 'flex';
      });
      
      // Close blog modal
      closeModal.addEventListener('click', function() {
        blogModal.style.display = 'none';
      });
      
      window.addEventListener('click', function(e) {
        if (e.target === blogModal) {
          blogModal.style.display = 'none';
        }
      });
      
      // Save draft
      saveDraftBtn.addEventListener('click', function() {
        const title = postTitle.value;
        const content = quill.root.innerHTML;
        
        if (!title) {
          alert('Please enter a title for your post');
          return;
        }
        
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        posts.push({
          id: Date.now(),
          title,
          content,
          isDraft: true,
          createdAt: new Date().toISOString()
        });
        
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        blogModal.style.display = 'none';
        loadBlogPosts();
      });
      
      // Publish post
      publishBtn.addEventListener('click', function() {
        const title = postTitle.value;
        const content = quill.root.innerHTML;
        
        if (!title) {
          alert('Please enter a title for your post');
          return;
        }
        
        if (!content || quill.getText().trim().length < 10) {
          alert('Please add more content to your post');
          return;
        }
        
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        posts.push({
          id: Date.now(),
          title,
          content,
          isDraft: false,
          createdAt: new Date().toISOString()
        });
        
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        blogModal.style.display = 'none';
        loadBlogPosts();
      });
      
      // Load initial blog posts
      loadBlogPosts();
      
      // Testimonials Carousel
      const carousel = document.getElementById('testimonialsCarousel');
      const carouselItems = carousel.querySelectorAll('.carousel-item');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      let currentSlide = 0;
      let slideInterval;
      
      function showSlide(index) {
        carouselItems.forEach(item => item.classList.remove('active'));
        
        if (index < 0) {
          currentSlide = carouselItems.length - 1;
        } else if (index >= carouselItems.length) {
          currentSlide = 0;
        } else {
          currentSlide = index;
        }
        
        carouselItems[currentSlide].classList.add('active');
      }
      
      function startSlideshow() {
        slideInterval = setInterval(() => {
          showSlide(currentSlide + 1);
        }, 5000);
      }
      
      function stopSlideshow() {
        clearInterval(slideInterval);
      }
      
      prevBtn.addEventListener('click', () => {
        stopSlideshow();
        showSlide(currentSlide - 1);
        startSlideshow();
      });
      
      nextBtn.addEventListener('click', () => {
        stopSlideshow();
        showSlide(currentSlide + 1);
        startSlideshow();
      });
      
      // Start slideshow
      startSlideshow();
      
      // Contact Form Validation
      const contactForm = document.getElementById('contactForm');
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const messageError = document.getElementById('messageError');
      const submitBtn = document.getElementById('submitBtn');
      const submitSpinner = document.getElementById('submitSpinner');
      const formSuccess = document.getElementById('formSuccess');
      
      function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }
      
      function validateForm() {
        let isValid = true;
        
        // Name validation
        if (nameInput.value.trim() === '') {
          nameError.textContent = 'Name is required';
          isValid = false;
        } else {
          nameError.textContent = '';
        }
        
        // Email validation
        if (emailInput.value.trim() === '') {
          emailError.textContent = 'Email is required';
          isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
          emailError.textContent = 'Please enter a valid email address';
          isValid = false;
        } else {
          emailError.textContent = '';
        }
        
        // Message validation
        if (messageInput.value.trim() === '') {
          messageError.textContent = 'Message is required';
          isValid = false;
        } else {
          messageError.textContent = '';
        }
        
        return isValid;
      }
      
      submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
          return;
        }
        
        // Show loading spinner
        submitBtn.disabled = true;
        submitSpinner.style.display = 'inline-block';
        
        // Simulate API call
        setTimeout(() => {
          submitBtn.disabled = false;
          submitSpinner.style.display = 'none';
          contactForm.style.display = 'none';
          formSuccess.style.display = 'block';
          
          // Reset form
          nameInput.value = '';
          emailInput.value = '';
          messageInput.value = '';
        }, 1500);
      });
    });