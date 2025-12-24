import gui.MainGUI;
import Performance.PerformanceTester;
import algorithms.*;
import java.util.Arrays;
import java.util.List;
import javax.swing.JOptionPane;

public class Main {
    public static void main(String[] args) {

        String[] options = {"Visualizer", "Performance Test", "Exit"};

        int ch = JOptionPane.showOptionDialog(
                null, "Choose:",
                "Sorting Project",
                JOptionPane.DEFAULT_OPTION,
                JOptionPane.PLAIN_MESSAGE,
                null, options, options[0]
        );

        if (ch == 0) {
            MainGUI.showGUI();
        }
        else if (ch == 1) {
            List<SortAlgorithm> algs = Arrays.asList(
                    new InsertionSort(),
                    new SelectionSort(),
                    new MergeSort(),
                    new QuickSort()
            );

            int[] sizes = {100, 1000, 5000, 10000};
            PerformanceTester pt = new PerformanceTester(algs, sizes, 3, 7);

            pt.runAndSave("results.csv");
            JOptionPane.showMessageDialog(null, "results.csv oluşturuldu ✅");
        }
        else System.exit(0);
    }
}

