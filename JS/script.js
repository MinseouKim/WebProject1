// 글로벌 변수 설정
const API_KEY = "AIzaSyDayWCyN3ohOnmtb3maWjlAkgFWPbfa1Vo"; // YouTube API 키

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal.style.display === 'flex') {
        modal.style.opacity = '0';
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    } else {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        }, 10);
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    document.getElementById('loading').style.display = 'flex';

    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        if (username && password) {
            alert('로그인 성공!');
            toggleModal('loginModal');
            document.querySelector('.menu-btn').innerHTML = `<i class="fas fa-user"></i> ${username}님`;
        } else {
            alert('아이디와 비밀번호를 입력해주세요.');
        }
    }, 1000);
}

function refreshPage() {
    location.reload();
}

function createExtraSteam() {
    const logo = document.querySelector('.logo');
    const extraSteam = document.createElement('div');
    extraSteam.className = 'steam extra-steam';
    extraSteam.style.width = (10 + Math.random() * 15) + 'px';
    extraSteam.style.height = extraSteam.style.width;
    extraSteam.style.left = (30 + Math.random() * 40) + '%';
    extraSteam.style.animationDuration = (2 + Math.random() * 2) + 's';
    logo.appendChild(extraSteam);
    setTimeout(() => extraSteam.remove(), 3000);
}

function speakRecipe(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        speechSynthesis.speak(utterance);
    } else {
        alert('음성 재생이 지원되지 않는 브라우저입니다.');
    }
}

// 개선된 레시피 추천 함수
function recommendRecipe() {
    const ingredients = document.getElementById('ingredients').value.trim();
    const resultDiv = document.getElementById('result');
    document.getElementById('loading').style.display = 'flex';

    if (!ingredients) {
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
            resultDiv.innerHTML = '<p>재료를 입력해주세요!</p>';
        }, 500);
        return;
    }

    // 여기는 AI 기반 추천을 위해 비워둠
    
    // 재료에 맞는 YouTube 영상 검색
    const searchQuery = ingredients + " 요리 레시피";
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=4&q=${encodeURIComponent(searchQuery)}&type=video&order=viewCount&key=${API_KEY}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`YouTube API 응답 오류: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('loading').style.display = 'none';
            
            // YouTube 영상 HTML 구성
            let html = '';
            
            // 결과 영역 비워두기 - AI 추천 위치
            html += '<div class="recipe-container">';
            html += '</div>';

            // YouTube 영상 HTML 구성
            if (data.items && data.items.length > 0) {
                html += `
                <div class="youtube-results">
                    <h3>"${ingredients}" 활용 인기 요리 영상</h3>
                    <div class="video-grid">`;
                
                data.items.forEach(item => {
                    const videoId = item.id.videoId;
                    const videoTitle = item.snippet.title;
                    const thumbnailUrl = item.snippet.thumbnails.medium.url;
                    const channelTitle = item.snippet.channelTitle || "요리 채널";
                    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                    
                    html += `
                    <a href="${videoUrl}" target="_blank" class="video-result">
                        <img src="${thumbnailUrl}" alt="${videoTitle}" class="video-thumbnail">
                        <div class="video-title">${videoTitle}</div>
                        <div class="video-channel">${channelTitle}</div>
                    </a>`;
                });
                
                html += '</div></div>';
            }

            resultDiv.innerHTML = html;
        })
        .catch((error) => {
            console.error("YouTube API 오류:", error);
            document.getElementById('loading').style.display = 'none';
            
            // API 호출 실패 시 대체 내용 표시
            let html = '<div class="recipe-container"></div>';
            
            // 샘플 비디오 표시
            html += `
            <div class="youtube-results">
                <h3>"${ingredients}" 요리 영상</h3>
                <div class="video-grid">`;
            
            const sampleVideos = [
                { title: `${ingredients} 활용 요리법`, channel: "맛있는 요리 채널", thumbnail: "/api/placeholder/300/169" },
                { title: `집에서 만드는 ${ingredients} 요리`, channel: "홈쿡 마스터", thumbnail: "/api/placeholder/300/169" },
                { title: `초간단 ${ingredients} 레시피`, channel: "쉬운 요리", thumbnail: "/api/placeholder/300/169" },
                { title: `프로처럼 만드는 ${ingredients} 요리`, channel: "요리 전문가", thumbnail: "/api/placeholder/300/169" }
            ];
            
            sampleVideos.forEach(video => {
                html += `
                <a href="#" target="_blank" class="video-result">
                    <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
                    <div class="video-title">${video.title}</div>
                    <div class="video-channel">${video.channel}</div>
                </a>`;
            });
            
            html += '</div></div>';
            resultDiv.innerHTML = html;
        });
}

function toggleLoginModal() {
    toggleModal('loginModal');
}

function showCreatorModal() {
    toggleModal('creatorModal');
}

function closeCreatorModal() {
    toggleModal('creatorModal');
}

function showLoginTab() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginTabBtn").classList.add("active");
    document.getElementById("signupTabBtn").classList.remove("active");
}

function showSignupTab() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
    document.getElementById("loginTabBtn").classList.remove("active");
    document.getElementById("signupTabBtn").classList.add("active");
}

function signup() {
    const newUsername = document.getElementById('signupUsername').value;
    const newPassword = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupPasswordConfirm').value;

    if (!newUsername || !newPassword || !confirmPassword) {
        alert('모든 항목을 입력해주세요.');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    document.getElementById('loading').style.display = 'flex';

    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        alert(`회원가입 성공! ${newUsername}님 환영합니다 🎉`);
        showLoginTab(); // 로그인 탭으로 전환
    }, 1000);
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('ingredients').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') recommendRecipe();
    });
    
    document.querySelector('.logo').addEventListener('mouseover', createExtraSteam);
    setInterval(createExtraSteam, 2000);
    
    // 입력 그룹 포커스 설정
    document.querySelectorAll('.input-group').forEach(group => {
        group.addEventListener('click', () => {
            const input = group.querySelector('input');
            if (input) input.focus();
        });
    });
});