// script.js
let generatedNumbers = [];
const userNumbers = Array.from(document.querySelectorAll('#user-numbers .number-box'));
const generatedNumberBoxes = Array.from(document.querySelectorAll('#generated-numbers .number-box'));
const modal = document.getElementById('captcha-modal');
const resultElement = document.getElementById('result');

let touchStartY = 0;
let touchEndY = 0;
// 生成随机的六位数字并在弹窗中显示
function generateCaptcha() {
    generatedNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10));
    generatedNumberBoxes.forEach((box, index) => {
        box.textContent = generatedNumbers[index];
    });
    resultElement.textContent = ''; // 清空验证结果
    modal.style.display = 'flex'; // 显示弹窗
}

// 更新用户数字
function updateNumber(element, direction) {
    let currentNumber = parseInt(element.textContent);
    const originalNumber = currentNumber;

    if (direction === 'up') {
        currentNumber = (currentNumber + 1) % 10;
        element.classList.add('scroll-up'); // 添加向上滚动的类
    } else {
        currentNumber = (currentNumber - 1 + 10) % 10;
        element.classList.add('scroll-down'); // 添加向下滚动的类
    }

    element.textContent = currentNumber;

    // 短暂延迟后移除动画类，以便下次可以重新添加动画
    setTimeout(() => {
        element.classList.remove('scroll-up', 'scroll-down');
    }, 300); // 与 transition 过渡时间一致
}


// 处理滚轮事件
function handleScrollEvent(event) {
    event.preventDefault(); // 阻止页面滚动
    if (event.deltaY < 0) {
        updateNumber(event.currentTarget, 'up');
    } else {
        updateNumber(event.currentTarget, 'down');
    }
}

// 处理触控事件
const sensitivityThreshold = 20; // 触控滑动灵敏度阈值
function handleTouchEvent(event) {
    const touch = event.touches[0];
    if (touchStartY === 0) {
        touchStartY = touch.clientY;
    }

    touchEndY = touch.clientY;
    
    const distance = touchStartY - touchEndY;

    if (Math.abs(distance) > sensitivityThreshold) {
        if (distance > 0) {
            updateNumber(event.currentTarget, 'up');
        } else {
            updateNumber(event.currentTarget, 'down');
        }
        touchStartY = touchEndY;
    }
}

// 绑定每个数字的滚轮事件和触控事件
userNumbers.forEach(function(box) {
    box.addEventListener('wheel', handleScrollEvent);
    box.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY;
    });
    box.addEventListener('touchmove', handleTouchEvent);
    box.addEventListener('touchend', () => {
        touchStartY = 0; // 触控结束后重置触控起始位置
    });
});

// 验证用户输入的数字与生成的数字是否相同
function validateCaptcha() {
    const userInput = userNumbers.map(box => parseInt(box.textContent));
    const isCorrect = userInput.every((num, index) => num === generatedNumbers[index]);
    
    if (isCorrect) {
        resultElement.textContent = '验证码正确';
        resultElement.style.color = 'green';
    } else {
        resultElement.textContent = '验证码错误';
        resultElement.style.color = 'red';
    }
}

// 关闭弹窗
function closeModal() {
    modal.style.display = 'none';
}

// 点击生成验证码按钮时，弹出弹窗并显示生成的验证码
document.getElementById('generate-captcha').addEventListener('click', generateCaptcha);

// 点击确定按钮时，进行验证
document.getElementById('submit-captcha').addEventListener('click', validateCaptcha);

// 点击关闭按钮时，关闭弹窗
document.getElementById('close-modal').addEventListener('click', closeModal);
