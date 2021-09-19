import { of, ReplaySubject, timer } from 'rxjs';
import { delay, filter, map, mapTo } from 'rxjs/operators';

describe('RxJs testing patterns -', function() {

	describe('How to test empty observable -', function() {

		it('should check that ReplaySubject is empty at start', function() {

			// given
			const nextFn = jest.fn();

			// when
			new ReplaySubject(1)
				.subscribe({
					next: value => nextFn(value)
				});

			// then
			expect(nextFn).not.toHaveBeenCalled();
		});

		it('should verify value greater than 3', function() {

			// given
			const nextFn = jest.fn();

			// when
			of(1, 2, 3)
				.pipe(
					filter(v => v > 3)
				)
				.subscribe({
					next: value => nextFn(value)
				});

			// then
			expect(nextFn).not.toHaveBeenCalled();

		});
	});


	describe('Slow your tests execution with done -', function() {

		it('should wait for debounce to end', function(done) {

			// given
			const givenValue = 'Bruce Wayne';

			// when
			of(givenValue)
				.pipe(
					delay(3000)
				)
				.subscribe({
					next: value => {

						// then
						expect(value).toEqual(givenValue);
					},
					complete: () => done()
				});
		});

		it('should work fast with fake timers', function() {

			jest.useFakeTimers();

			// given
			const givenValue = 'Bruce Wayne',
				nextFn = jest.fn();

			// when
			of(givenValue)
				.pipe(
					delay(3000)
				)
				.subscribe({
					next: value => nextFn(value)
				});

			jest.advanceTimersByTime(3000);

			expect(nextFn).toHaveBeenCalledWith(givenValue);
		});

		it('should work for timer', function() {

			jest.useFakeTimers();

			// given
			const givenValue = 'Bruce Wayne',
				nextFn = jest.fn();

			// when
			timer(3000)
				.pipe(
					mapTo(givenValue)
				)
				.subscribe({
					next: value => nextFn(value)
				});

			jest.advanceTimersByTime(3000);

			expect(nextFn).toHaveBeenCalledWith(givenValue);
		});

	});

	describe('series of values -', function() {

		it('should test a series of values with mock function', () => {

			// given
			const nextFn = jest.fn();

			// when
			of(1, 2, 3)
				.pipe(
					map(v => v * 3)
				)
				.subscribe(v => nextFn(v));

			// then
			expect(nextFn).toHaveBeenCalledWith(3);
			expect(nextFn).toHaveBeenCalledWith(6);
			expect(nextFn).toHaveBeenCalledWith(9);
		});

	});

});
