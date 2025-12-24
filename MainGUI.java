package gui;

import algorithms.*;
import javax.swing.*;
import java.awt.*;
import java.util.Random;
import java.util.concurrent.atomic.AtomicBoolean;

public class MainGUI {

    private JFrame frame;
    private VisualizerPanel viz = new VisualizerPanel();
    private ControlPanel controls = new ControlPanel();

    private int[] baseArray;
    private AtomicBoolean running = new AtomicBoolean(false);
    private AtomicBoolean paused = new AtomicBoolean(false);

    private Thread sortThread;

    private Color currentColor = Color.WHITE;

    public MainGUI() {
        frame = new JFrame("Sorting Visualizer - Ceyda Edition");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(900,600);
        frame.setLayout(new BorderLayout());
        frame.add(viz, BorderLayout.CENTER);
        frame.add(controls, BorderLayout.SOUTH);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);

        controls.randomBtn.addActionListener(e -> newArray());
        controls.startBtn.addActionListener(e -> start());
        controls.stopBtn.addActionListener(e -> stop());

        newArray();
    }

    private void setColorByAlgorithm(String algo) {
        switch(algo) {
            case "Insertion": currentColor = new Color(255,100,180); break;
            case "Selection": currentColor = new Color(255,220,100); break;
            case "Merge": currentColor = new Color(100,150,255); break;
            case "Quick": currentColor = new Color(200,120,255); break;
        }
        viz.setDefaultColor(currentColor);
    }

    private void newArray() {
        Random r = new Random();
        baseArray = new int[150];
        for(int i=0;i<150;i++) baseArray[i] = r.nextInt(300)+20;
        viz.setArray(baseArray);
    }

    private void start() {
        if (running.get()) {
            paused.set(!paused.get());
            controls.startBtn.setText(paused.get() ? "Resume" : "Pause");
            return;
        }

        if (baseArray == null) newArray();

        running.set(true);
        paused.set(false);

        controls.startBtn.setText("Pause");
        controls.stopBtn.setEnabled(true);
        controls.randomBtn.setEnabled(false);

        String algo = (String)controls.sortSelect.getSelectedItem();
        int delay = controls.speedSlider.getValue();

        setColorByAlgorithm(algo);

        sortThread = new Thread(() -> runAlgo(algo, delay));
        sortThread.start();
    }

    private void stop() {
        running.set(false);
        paused.set(false);
        controls.startBtn.setText("Start");
        controls.stopBtn.setEnabled(false);
        controls.randomBtn.setEnabled(true);
    }

    private void waitPause() throws InterruptedException {
        while(paused.get()) {
            Thread.sleep(10);
        }
    }

    private void runAlgo(String a, int d) {
        int[] arr = viz.copyArray();
        long start = System.nanoTime();

        try {
            switch(a) {
                case "Insertion": insertion(arr,d); break;
                case "Selection": selection(arr,d); break;
                case "Merge": merge(arr,0,arr.length-1,d); break;
                case "Quick": quick(arr,0,arr.length-1,d); break;
            }
        } catch(Exception ignore){}

        long end = System.nanoTime();
        controls.timeLabel.setText("Time: " + (end-start)/1_000_000 + " ms");

        running.set(false);
        paused.set(false);
        controls.startBtn.setText("Start");
        controls.stopBtn.setEnabled(false);
        controls.randomBtn.setEnabled(true);
    }

    private void showArray(int[] arr, int highlight) throws Exception {
        waitPause();
        viz.setArray(arr);
        if (highlight >= 0) viz.highlight(highlight, currentColor);
        Thread.sleep(controls.speedSlider.getValue());
    }

    private void insertion(int[] arr,int d) throws Exception {
        for(int i=1;i<arr.length && running.get();i++){
            int key=arr[i], j=i-1;
            while(j>=0 && arr[j]>key && running.get()){
                arr[j+1]=arr[j];
                showArray(arr, j);
                j--;
            }
            arr[j+1]=key;
            showArray(arr,-1);
        }
    }

    private void selection(int[] arr,int d) throws Exception {
        for(int i=0;i<arr.length && running.get();i++){
            int min=i;
            for(int j=i+1;j<arr.length && running.get();j++){
                if(arr[j]<arr[min]) min=j;
                showArray(arr,j);
            }
            int tmp=arr[min]; arr[min]=arr[i]; arr[i]=tmp;
            showArray(arr,i);
        }
    }

    private void merge(int[] a,int l,int r,int d) throws Exception {
        if(!running.get() || l>=r) return;
        int m=(l+r)/2;
        merge(a,l,m,d);
        merge(a,m+1,r,d);
        mergeDo(a,l,m,r,d);
    }

    private void mergeDo(int[] a,int l,int m,int r,int d) throws Exception {
        int[] tmp=new int[r-l+1];
        int i=l,j=m+1,k=0;
        while(i<=m && j<=r && running.get()) tmp[k++] = (a[i]<=a[j])?a[i++]:a[j++];
        while(i<=m && running.get()) tmp[k++] = a[i++];
        while(j<=r && running.get()) tmp[k++] = a[j++];

        System.arraycopy(tmp,0,a,l,tmp.length);
        showArray(a,-1);
    }

    private void quick(int[] a,int l,int r,int d) throws Exception {
        if(!running.get() || l>=r) return;
        int p=part(a,l,r,d);
        quick(a,l,p-1,d);
        quick(a,p+1,r,d);
    }

    private int part(int[] a,int l,int r,int d) throws Exception {
        int pivot=a[r];
        int i=l-1;
        for(int j=l;j<r && running.get();j++){
            if(a[j]<=pivot){
                i++;
                int tmp=a[i]; a[i]=a[j]; a[j]=tmp;
                showArray(a,j);
            }
        }
        int tmp=a[i+1]; a[i+1]=a[r]; a[r]=tmp;
        showArray(a,-1);
        return i+1;
    }

    public static void showGUI() {
        SwingUtilities.invokeLater(MainGUI::new);
    }
}








