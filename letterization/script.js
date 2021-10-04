const config = {
	type: 1
};

const effects = {
	1: {
		mouseMotion: e => {
			const thresholdDistance = 150;
			const {
				clientX: x,
				clientY: y
			} = e;
			[...document.querySelectorAll('.letter')].map(e => {
				const {
					x: letterX,
					y: letterY,
					width: letterWidth,
					height: letterHeight
				} = e.getBoundingClientRect();
				const posX = letterX + letterWidth / 2;
				const posY = letterY + letterHeight / 2;
				const distSquare = (x - posX) ** 2 + (y - posY) ** 2;
				// e.style.transform = `translateY(-${distSquare}px)`;
				if (distSquare < thresholdDistance ** 2) {
					e.style.transform = `translateY(-${(thresholdDistance ** 2 - distSquare) * 0.00004}em)`;
				} else {
					e.style.transform = null;
				}
				// e.style.color = 'red';
			});
		},
		apply: () => {
			window.addEventListener('mousemove', effects[1].mouseMotion);
		},
		remove: () => {
			window.removeEventListener('mousemove', effects[1].mouseMotion);
			[...document.querySelectorAll('.letter')].map(e => e.style.transform = null);
		}
	},
	2: {
		mouseAbove: e => {
			const { target: elem } = e;
			elem.style.color = 'white';
			elem.style.backgroundColor = 'white';
			elem.style.borderRadius = '50%';
		},
		apply: () => {
			[...document.querySelectorAll('.letter')].map(e => e.addEventListener('mouseover', effects[2].mouseAbove));
		},
		remove: () => {
			[...document.querySelectorAll('.letter')].map(e => {
				e.removeEventListener('mouseover', effects[2].mouseAbove);
				e.style.color = null;
				e.style.backgroundColor = null;
				e.style.borderRadius = null;
			});
		}
	},
	3: {
		mouseMotion: e => {
			const thresholdDistance = 180;
			const {
				clientX: x,
				clientY: y
			} = e;
			[...document.querySelectorAll('.letter')].map(e => {
				const {
					x: letterX,
					y: letterY,
					width: letterWidth,
					height: letterHeight
				} = e.getBoundingClientRect();
				const posX = letterX + letterWidth / 2;
				const posY = letterY + letterHeight / 2;
				const distSquare = (x - posX) ** 2 + (y - posY) ** 2;
				if (
					distSquare < thresholdDistance ** 2
				) {
					e.style.color = randomColour();
				} else {
					e.style.color = '#444';
				}
			});
		},
		apply: () => {
			window.addEventListener('mousemove', effects[3].mouseMotion);
			[...document.querySelectorAll('.letter')].map(e => e.style.color = '#444');
		},
		remove: () => {
			window.removeEventListener('mousemove', effects[3].mouseMotion);
			[...document.querySelectorAll('.letter')].map(e => e.style.color = null);
		}
	}
};

const render = () => {
	switch (config.type) {
		case 1:
		case 3: {
			const typeListener = e => {
				if (config.type !== 1 && config.type !== 3)
					return window.removeEventListener('mousemove', typeListener);

				const mains = document.querySelectorAll('.main');
				[...mains].forEach(main => {
					const {
						x: mainX,
						y: mainY,
						width: mainW,
						height: mainH
					} = main.getBoundingClientRect();
					const {
						clientX: moX,
						clientY: moY
					} = e;
					if (
						mainX <= moX && moX <= mainX + mainW
						&& mainY <= moY && moY <= mainY + mainH
					) {
						effects[config.type].apply();
					} else {
						effects[config.type].remove();
					}
				});
			};
			window.addEventListener('mousemove', typeListener);
		}
		break;
		case 2: {
			effects[2].apply();
		}
		break;
		default:
	}
};

window.addEventListener('load', () => {
	[...document.querySelectorAll('nav button')].forEach(btn => {
		const id = Number(btn.attributes['data-value'].value);
		btn.addEventListener('click', () => {
			if (config.type === 2) {
				effects[config.type].remove();
			}
			config.type = id;
			document.querySelector('nav button.active')?.classList.remove('active');
			btn.classList.add('active');
			render();
		});
		if (id === config.type)
			btn.classList.add('active');
	});

	const obj = new Letterize({
		targets: '#letters'
	});
	/* obj.listAll
		.filter(e => e.innerHTML === '&nbsp;')
		.forEach(e => {
			e.textContent = ' ';
		}); */
	obj.listAll.forEach(e => {
		e.classList.add('letter');
	});

	render();
});

function randomColour() {
	// return '#' + Math.floor(Math.random() * 16777215).toString(16);

	function sinToHhex(i, phase) {
		var sin = Math.sin(Math.PI / size * 2 * i + phase);
		var int = Math.floor(sin * 127) + 128;
		var hex = int.toString(16);
	
		return hex.length === 1 ? '0' + hex : hex;
	}

	const size = 12;
	const num = Math.floor(Math.random() * (12 + 1));
	const red   = sinToHhex(num, 0 * Math.PI * 2/3);
	const blue  = sinToHhex(num, 1 * Math.PI * 2/3);
	const green = sinToHhex(num, 2 * Math.PI * 2/3);
	return `#${red}${green}${blue}`;
}