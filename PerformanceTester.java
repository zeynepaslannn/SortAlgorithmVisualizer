package Performance;

import algorithms.*;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

public class PerformanceTester {
    private List<SortAlgorithm> algorithms;
    private int[] sizes;
    private int trials;
    private Random rng;

    public PerformanceTester(List<SortAlgorithm> algorithms, int[] sizes,
                             int trials, long seed) {
        this.algorithms = algorithms;
        this.sizes = sizes;
        this.trials = trials;
        this.rng = new Random(seed);
    }

    public void runAndSave(String csvPath) {
        try (FileWriter writer = new FileWriter(csvPath)) {

            writer.write("Algorithm,Size,Trial,Time_ns\n");

            for (int n : sizes) {
                for (int t = 1; t <= trials; t++) {
                    int[] base = generateRandomArray(n);

                    for (SortAlgorithm alg : algorithms) {
                        int[] arr = Arrays.copyOf(base, base.length);
                        long start = System.nanoTime();
                        alg.sort(arr);
                        long time = System.nanoTime() - start;

                        writer.write(String.format("%s,%d,%d,%d\n",
                                alg.name(), n, t, time));
                    }
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private int[] generateRandomArray(int n) {
        int[] a = new int[n];
        for (int i = 0; i < n; i++)
            a[i] = new Random().nextInt(1000);
        return a;
    }
}

