import { PermissionFlagsBits } from 'discord-api-types/v10';

const easing = 'cubic-bezier(.35,1.58,1,.83)';
let dotFirstAppear = true;
const offset = 26;

export const updateDotPos = (dotContainer: HTMLDivElement, mouseY: number) => {
	if (!dotContainer) return null;

	dotContainer.style.top = `${dotContainer.getBoundingClientRect().top}px`;

	dotContainer.animate([{ top: dotContainer.style.top }, { top: `${mouseY + offset}px` }], {
		duration: 200,
		easing,
		fill: 'forwards',
	});
};

export const showDot = (dotContainer: HTMLDivElement, y: number) => {
	if (!dotContainer) return;
	if (dotContainer.style.top === `${y + offset}px` && !dotFirstAppear) return;

	dotContainer.animate(
		[
			{
				top: dotFirstAppear ? `${y + offset}px` : dotContainer.style.top,
				left: dotFirstAppear ? '-8px' : '-4px',
			},
			{ top: `${y + offset}px`, left: '-4px' },
		],
		{ duration: 200, easing, fill: 'forwards' },
	);

	dotFirstAppear = false;
	dotContainer.style.top = `${y + offset}px`;
	dotContainer.style.left = '-4px';
};

export const hideDot = (dotContainer: HTMLDivElement) => {
	if (!dotContainer) return;
	dotFirstAppear = true;

	dotContainer.animate([{ left: '-4px' }, { left: '-8px' }], {
		duration: 200,
		easing,
		fill: 'forwards',
	});

	dotContainer.style.left = '-8px';
};

export const showName = (
	event: { y: number },
	dotContainer: HTMLDivElement,
	nameContainer: HTMLDivElement,
) => {
	showDot(dotContainer, event.y);
	if (!nameContainer) return;

	nameContainer.style.top = `${event.y + offset}px`;
};

export const scroll = (dotContainer: HTMLDivElement, mouseY: number) => {
	updateDotPos(dotContainer, mouseY);
};

export const canManage = (permissions: bigint) =>
	(permissions & PermissionFlagsBits.ManageGuild) === PermissionFlagsBits.ManageGuild;

export const setMouse = (y: number, mouseY: number) => {
	mouseY = y - offset;
};
